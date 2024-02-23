import { Chain } from 'viem'
import { FixedNumber, mulFN, addFN, divFN, subFN } from '../common/fixedNumber'
import { ActionParam } from '../interfaces/IActionExecutor'
import { IAdapterV1, ProtocolInfo } from '../interfaces/V1/IAdapterV1'
import {
  ProtocolId,
  AvailableToTradeParams,
  ApiOpts,
  AmountInfo,
  DepositWithdrawParams,
  MarketInfo,
  DynamicMarketMetadata,
  CreateOrder,
  UpdateOrder,
  CancelOrder,
  AgentParams,
  PositionInfo,
  ClosePositionData,
  UpdatePositionMarginData,
  IdleMarginInfo,
  PageOptions,
  PaginatedRes,
  OrderInfo,
  HistoricalTradeInfo,
  LiquidationInfo,
  ClaimInfo,
  OpenTradePreviewInfo,
  CloseTradePreviewInfo,
  PreviewInfo,
  AccountInfo,
  MarketState,
  AgentState,
  OrderBook,
  Market,
  GenericStaticMarketMetadata,
  Protocol,
  PnlData,
  TradeData,
  OrderType,
  TriggerData,
  OBData
} from '../interfaces/V1/IRouterAdapterBaseV1'
import { optimism, arbitrum } from 'viem/chains'
import { OpenAPI, time_in_force } from '../../generated/aevo'
import { aevoAddresses } from '../configs/aevo/addresses'
import { L1SocketDepositHelper, L1SocketDepositHelper__factory } from '../../typechain/aevo'
import { rpc } from '../common/provider'
import { SupportedChains, Token, tokens } from '../common/tokens'
import { IERC20, IERC20__factory } from '../../typechain/gmx-v1'
import { BigNumber, ethers } from 'ethers'
import { AEVO_DEPOSIT_H, EMPTY_DESC, getApproveTokenHeading } from '../common/buttonHeadings'
import { signCreateOrder, signRegisterAgent, signRegisterWallet, updateAevoLeverage } from '../configs/aevo/signing'
import { AevoClient } from '../../generated/aevo'
import {
  AEVO_CACHE_PREFIX,
  CACHE_DAY,
  CACHE_MINUTE,
  CACHE_SECOND,
  CACHE_TIME_MULT,
  cacheFetch,
  getStaleTime
} from '../common/cache'
import {
  AEVO_COLLATERAL_TOKEN,
  AEVO_DEFAULT_MAKER_FEE,
  AEVO_DEFAULT_MAKER_FEE_PRE_LAUNCH,
  AEVO_DEFAULT_TAKER_FEE,
  AEVO_DEFAULT_TAKER_FEE_PRE_LAUNCH,
  AEVO_FEE_MAP,
  AEVO_NORMAL_MM,
  AEVO_PRE_LAUNCH_MM,
  AEVO_TOKENS_MAP,
  aevo
} from '../configs/aevo/config'
import { encodeMarketId } from '../common/markets'
import { ZERO_FN } from '../common/constants'
import {
  aevoIndexBasisSlippage,
  aevoMarketIdToAsset,
  aevoInstrumentNameToAsset,
  to6Decimals,
  getReqdLeverage,
  toNearestTick,
  getReqdLeverageFN,
  aevoMapAevoObToObData
} from '../configs/aevo/helper'
import {
  aevoCacheGetAccount,
  aevoCacheGetAllMarkets,
  aevoCacheGetCoingeckoStats,
  aevoCacheGetAllAssets,
  aevoCacheGetOrderbook
} from '../configs/aevo/aevoCacheHelper'
import { openAevoWssConnection, getAevoWssTicker, getAevoWssOrderBook } from '../configs/aevo/aevoWsClient'
import { slippagePrice } from '../configs/hyperliquid/api/client'
import { getPaginatedResponse, toAmountInfoFN, validDenomination } from '../common/helper'
import {
  CANNOT_CHANGE_MODE,
  LEV_OUT_OF_BOUNDS,
  MARGIN_DENOMINATION_USD,
  SIZE_DENOMINATION_TOKEN
} from '../configs/hyperliquid/hlErrors'
import { TraverseResult } from '../common/types'
import { traverseAevoBook } from '../configs/aevo/aevoObTraversal'
import { AEVO_CREDENTIAL_MISSING_ERROR } from '../common/errors'

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

type AllowedMethods = FunctionKeys<AevoClient['privateApi']>

type UrlParams = { [key: string]: string | number }

export const AEVO_REF_CODE = 'Bitter-Skitter-Lubin'

type ActualPosition = NonNullable<
  Awaited<ReturnType<(typeof AevoClient)['prototype']['privateApi']['getAccount']>>['positions']
>[0]
type AccountData = Awaited<ReturnType<(typeof AevoClient)['prototype']['privateApi']['getAccount']>>

export class ExtendedAevoClient extends AevoClient {
  headers: Record<string, string> & HeadersInit = {
    'Content-Type': 'application/json'
  }

  public setCredentials(apiKey: string, apiSecret: string) {
    if (!apiKey || !apiSecret) throw new Error('key or secret not passed')

    this.headers['AEVO-KEY'] = apiKey
    this.headers['AEVO-SECRET'] = apiSecret

    this.request.config.HEADERS = this.headers
  }

  private _getUrlAndMethod(name: AllowedMethods, params?: UrlParams): { url: string; method: RequestInit['method'] } {
    let method: RequestInit['method']
    let url: string

    switch (true) {
      case name.startsWith('get'):
        method = 'GET'
        url = this.parseNestedPath(name, params)
        break
      case name.startsWith('post'):
        method = 'POST'
        url = this.parseNestedPath(name, params)
        break
      case name.startsWith('put'):
        method = 'PUT'
        url = this.parseNestedPath(name, params)
        break
      case name.startsWith('delete'):
        method = 'DELETE'
        url = this.parseNestedPath(name, params)
        break
      default:
        throw new Error('Not able to parse method and URL')
    }

    return { url, method }
  }

  private parseNestedPath(name: string, params?: UrlParams): string {
    // splitting camel case method name to url
    const pathSegments = name.split(/(?=[A-Z])/).map((segment) => segment.toLowerCase())
    let url = ''

    for (const segment of pathSegments) {
      if (segment === 'delete' || segment === 'put') {
        url += '/'
      } else if (segment !== 'get' && segment !== 'post') {
        url += `/${segment}`
      }
    }

    // to handle cases like DELETE /order/:id
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(key, String(value))
      })
    }

    return url
  }

  // helper to infer types since we can't use generated client because fetch needs to be seperate
  public transform<T extends AllowedMethods>(
    name: T,
    args: Parameters<AevoClient['privateApi'][T]>[0],
    urlParams?: UrlParams
  ) {
    if (!args) throw new Error('request body not passed')

    let { method, url } = this._getUrlAndMethod(name, urlParams)
    url = OpenAPI.BASE + url

    const body = JSON.stringify(args)

    const params: Parameters<typeof fetch> = [
      url,
      {
        body,
        method,
        headers: this.headers
      }
    ]

    return params
  }
}

export default class AevoAdapterV1 implements IAdapterV1 {
  protocolId: ProtocolId = 'AEVO'

  private static AEVO_GAS_LIMIT = 650_000
  private static AEVO_GAS_LIMIT_WITH_BUFFER = 650_000 + 65_000 // 10% buffer

  public aevoClient = new ExtendedAevoClient()

  public publicApi = this.aevoClient.publicApi
  public privateApi = this.aevoClient.privateApi

  private contracts: Record<SupportedChains, L1SocketDepositHelper> = {
    10: L1SocketDepositHelper__factory.connect(aevoAddresses[optimism.id].socketHelper, rpc[10]),
    42161: L1SocketDepositHelper__factory.connect(aevoAddresses[arbitrum.id].socketHelper, rpc[42161])
  }

  private tokenSpentApprovedMap: Record<string, boolean> = {}

  private lastSig: string = ''
  private lastAddress: `0x${string}` = ethers.constants.AddressZero

  getProtocolInfo(): ProtocolInfo {
    const info: ProtocolInfo = {
      hasAgent: true,
      hasAccount: true,
      hasOrderbook: true,
      sizeDeltaInToken: true,
      explicitFundingClaim: false,
      collateralDeltaInToken: true,
      collateralUsesLimitPricing: false,
      depositData: {
        10: [tokens.USDC, tokens['USDC.e'], tokens.WETH, tokens.ETH],
        42161: [tokens.USDC, tokens['USDC.e'], tokens.WETH, tokens.ETH]
      }
    }

    return info
  }

  async getAvailableToTrade(
    wallet: string,
    params: AvailableToTradeParams<this['protocolId']>,
    opts?: ApiOpts | undefined
  ): Promise<AmountInfo> {
    this._setCredentials(opts, true)

    const sTimeAccount = getStaleTime(CACHE_SECOND * 3, opts)
    const accountInfo = await aevoCacheGetAccount(this.privateApi, sTimeAccount, sTimeAccount * CACHE_TIME_MULT, opts)

    return toAmountInfoFN(FixedNumber.fromString(accountInfo.available_balance), false)
  }

  async init(wallet: string | undefined, opts?: ApiOpts | undefined): Promise<void> {
    await this._preWarmCache(opts)
    await openAevoWssConnection()
  }

  async setup(): Promise<ActionParam[]> {
    await openAevoWssConnection()
    return Promise.resolve([])
  }

  async _approveIfNeeded(
    wallet: string,
    spender: string,
    amount: bigint,
    chainId: Chain['id'],
    token: { contract: IERC20; data: Token }
  ): Promise<ActionParam | undefined> {
    const key = `${wallet}-${token}-${spender}`
    if (this.tokenSpentApprovedMap[key]) return

    const allowance = await token.contract.allowance(wallet, spender)

    // if allowance is 80% of Max then
    if (allowance.gt(ethers.constants.MaxUint256.mul(8).div(10))) {
      this.tokenSpentApprovedMap[key] = true
    }

    if (allowance.gt(amount)) return

    const tx = await token.contract.populateTransaction.approve(spender, ethers.constants.MaxUint256)

    return {
      tx,
      chainId,
      isUserAction: true,
      heading: getApproveTokenHeading(token.data.symbol),
      desc: EMPTY_DESC
    }
  }

  async _getExtraBridgeFee(chainId: Chain['id'], connector: string) {
    const key = [AEVO_CACHE_PREFIX, 'getExtraBridgeFee', chainId, connector]

    const url = `https://prod.dlapi.socket.tech/estimate-min-fees?srcPlug=${connector}&srcChainSlug=${chainId}&dstChainSlug=2999&msgGasLimit=${AevoAdapterV1.AEVO_GAS_LIMIT_WITH_BUFFER}&dstValue=1`

    return cacheFetch({
      key,
      fn: async () => Number(((await (await fetch(url)).json()) as { status: 'SUCCESS'; result: string }).result),
      staleTime: 5 * CACHE_MINUTE,
      cacheTime: 2 * 5 * CACHE_MINUTE
    })
  }

  async deposit(params: DepositWithdrawParams[]): Promise<ActionParam[]> {
    const payload: ActionParam[] = []

    for (const each of params) {
      // check if token is eth or not
      const isNativeETH = each.token.symbol === tokens.ETH.symbol

      // get gas price
      const connector = aevoAddresses[each.chainId].connector[isNativeETH ? 'WETH' : each.token.symbol]
      const additional = BigNumber.from(await this._getExtraBridgeFee(each.chainId, connector))

      const amount = each.amount.toFormat(each.token.decimals).value

      const ethRequired = isNativeETH ? additional.add(amount) : additional

      if (isNativeETH) {
        const tx = await this.contracts[each.chainId].populateTransaction.depositETHToAppChain(
          each.wallet,
          amount,
          AevoAdapterV1.AEVO_GAS_LIMIT,
          aevoAddresses[each.chainId].connector['WETH'],
          '0x',
          {
            value: ethRequired
          }
        )

        payload.push({
          tx,
          ethRequired,
          desc: EMPTY_DESC,
          isUserAction: true,
          chainId: each.chainId,
          isAgentRequired: false,
          heading: AEVO_DEPOSIT_H
        })

        continue
      }

      if (each.protocol !== 'AEVO') throw new Error('invalid protocol id')

      const address = each.token.address[each.chainId]

      if (!address || address === ethers.constants.AddressZero) throw new Error('token address not found')

      if (!aevoAddresses[each.chainId].vault || !this.contracts[each.chainId]) throw new Error('token not supported')

      const contract = IERC20__factory.connect(address, rpc[each.chainId])

      // approve if required
      const approval = await this._approveIfNeeded(
        each.wallet,
        this.contracts[each.chainId].address,
        amount,
        each.chainId,
        { contract, data: each.token }
      )

      if (approval) payload.push(approval)

      // deposit
      const tx = await this.contracts[each.chainId].populateTransaction.depositToAppChain(
        each.wallet,
        address,
        amount,
        AevoAdapterV1.AEVO_GAS_LIMIT,
        aevoAddresses[each.chainId].connector[each.token.symbol],
        '0x',
        {
          value: ethRequired
        }
      )

      payload.push({
        tx,
        ethRequired,
        desc: EMPTY_DESC,
        isUserAction: true,
        chainId: each.chainId,
        isAgentRequired: false,
        heading: AEVO_DEPOSIT_H
      })
    }

    return payload
  }

  // to maintain context while registering since it request sign from owner & burner
  _getSigKey() {
    if (!this.lastSig || !this.lastAddress || this.lastAddress == ethers.constants.AddressZero)
      throw new Error('invalid sig state')

    return {
      sig: this.lastSig,
      key: this.lastAddress
    }
  }

  // sets interim sig from agent wallet
  _setSig(key: `0x${string}`, sig: `0x${string}`) {
    this.lastSig = sig
    this.lastAddress = key

    if (!this.lastSig || !this.lastAddress || this.lastAddress == ethers.constants.AddressZero)
      throw new Error('invalid sig state')
  }

  // onboarding & setting referral code
  // called from write functions and authenticateAgent
  async _register(wallet: `0x${string}`): Promise<ActionParam[]> {
    const payload: ActionParam[] = []

    payload.push(signRegisterAgent(this, wallet))
    payload.push(signRegisterWallet(this))

    return payload
  }

  // should pass api keys in opts, if not passed then throws
  async getAgentState(wallet: string, agentParams: AgentParams[], opts?: ApiOpts): Promise<AgentState[]> {
    if (agentParams.length !== 1) throw new Error('agent params should be single item')

    const agent = agentParams[0]

    if (agent.protocolId !== 'AEVO') throw new Error('invalid protocol id')

    this._setCredentials(opts, true)

    const isAuthenticated = await this.privateApi
      .getAccount()
      .then((v) => (v.signing_keys?.some((k) => k.signing_key === agent.agentAddress) || false) && v.account === wallet)
      .catch((_) => false)

    return [
      {
        isAuthenticated,
        protocolId: 'AEVO',
        agentAddress: agent.agentAddress
      }
    ]
  }

  // registers with given agent, eoa sign required
  // if agent wallet is lost from local storage, generate only signing_key
  // if api keys are lost, then generate only api keys
  // TODO: check
  authenticateAgent(agentParams: AgentParams[], wallet: string, opts?: ApiOpts | undefined): Promise<ActionParam[]> {
    if (agentParams.length !== 1) throw new Error('agent params should be single item')

    const agent = agentParams[0]

    if (agent.protocolId !== 'AEVO') throw new Error('invalid protocol id')

    this._setCredentials(opts, false)

    return this._register(wallet as `0x${string}`)
  }

  withdraw(params: DepositWithdrawParams[]): Promise<ActionParam[]> {
    throw new Error('Method not implemented.')
  }

  supportedChains(opts?: ApiOpts | undefined): Chain[] {
    return [aevo]
  }

  async supportedMarkets(chains: Chain[] | undefined, opts?: ApiOpts | undefined): Promise<MarketInfo[]> {
    let marketInfo: MarketInfo[] = []

    if (chains == undefined || chains.includes(aevo)) {
      const sTimeMarkets = getStaleTime(CACHE_DAY, opts)
      const allMarkets = (
        await aevoCacheGetAllMarkets(this.publicApi, sTimeMarkets, sTimeMarkets * CACHE_TIME_MULT, opts)
      ).filter((m) => m.is_active)

      allMarkets.forEach((m) => {
        const market: Market = {
          marketId: encodeMarketId(aevo.id.toString(), this.protocolId, m.underlying_asset),
          chain: aevo,
          indexToken: AEVO_TOKENS_MAP[m.underlying_asset],
          longCollateral: [AEVO_COLLATERAL_TOKEN],
          shortCollateral: [AEVO_COLLATERAL_TOKEN],
          supportedModes: {
            ISOLATED: false,
            CROSS: true
          },
          supportedOrderTypes: {
            LIMIT: true,
            MARKET: true,
            STOP_LOSS: true,
            TAKE_PROFIT: true,
            STOP_LOSS_LIMIT: true,
            TAKE_PROFIT_LIMIT: true
          },
          supportedOrderActions: {
            CREATE: true,
            UPDATE: true,
            CANCEL: true
          },
          marketSymbol: m.underlying_asset
        }

        const staticMetadata: GenericStaticMarketMetadata = {
          maxLeverage: FixedNumber.fromString(m.max_leverage!),
          minLeverage: FixedNumber.fromString('1'),
          minInitialMargin: FixedNumber.fromString('1'),
          minPositionSize: FixedNumber.fromString(m.min_order_value),
          maxPrecision: 1,
          amountStep: FixedNumber.fromString(m.amount_step),
          priceStep: FixedNumber.fromString(m.price_step)
        }

        const protocol: Protocol = {
          protocolId: 'AEVO'
        }

        marketInfo.push({
          ...market,
          ...staticMetadata,
          ...protocol
        })
      })
    }

    return marketInfo
  }

  async getMarketPrices(marketIds: string[], opts?: ApiOpts | undefined): Promise<FixedNumber[]> {
    const assets = marketIds.map((mId) => aevoMarketIdToAsset(mId))
    const cachedTickers = assets.map((a) => getAevoWssTicker(a))

    if (!cachedTickers.includes(undefined)) {
      // return from cache
      return cachedTickers.map((t) => FixedNumber.fromString(t!.mark.price))
    } else {
      // get from allMarkets Api
      const sTimePrices = getStaleTime(CACHE_SECOND * 2, opts)
      const allMarkets = (await aevoCacheGetAllMarkets(this.publicApi, sTimePrices, sTimePrices, opts)).filter(
        (m) => m.is_active
      )

      return marketIds.map((marketId) => {
        const market = allMarkets.find((m) => m.underlying_asset == aevoMarketIdToAsset(marketId))
        return market ? FixedNumber.fromString(market.mark_price) : ZERO_FN
      })
    }
  }

  async getMarketsInfo(marketIds: string[], opts?: ApiOpts | undefined): Promise<MarketInfo[]> {
    let marketInfo: MarketInfo[] = []

    const supportedMarkets = await this.supportedMarkets(this.supportedChains(), opts)

    marketIds.forEach((mId) => {
      const market = supportedMarkets.find((m) => m.marketId === mId)
      if (market) {
        marketInfo.push(market)
      }
    })

    return marketInfo
  }

  async getDynamicMarketMetadata(marketIds: string[], opts?: ApiOpts | undefined): Promise<DynamicMarketMetadata[]> {
    let dynamicMarketMetadata: DynamicMarketMetadata[] = []

    const assets = marketIds.map((mId) => aevoMarketIdToAsset(mId))
    const cachedTickers = assets.map((a) => getAevoWssTicker(a))
    // count liquidity till LIQUIDITY_SLIPPAGE in bps
    const LIQUIDITY_SLIPPAGE = '100'

    // TODO - turn on when funding rate from cache is resolved
    // if (!cachedTickers.includes(undefined)) {
    //   // return from cache
    //   cachedTickers.forEach((t) => {
    //     const oiToken = FixedNumber.fromString(t!.open_interest)
    //     const iPrice = FixedNumber.fromString(t!.index_price)
    //     const oiUsd = oiToken.mulFN(iPrice).divFN(FixedNumber.fromString('2'))
    //     const fundingRate = FixedNumber.fromString(t!.funding_rate)

    //     dynamicMarketMetadata.push({
    //       oiLong: oiUsd,
    //       oiShort: oiUsd,
    //       availableLiquidityLong: ZERO_FN, // TODO - availableLiquidity from OB
    //       availableLiquidityShort: ZERO_FN, // TODO - availableLiquidity from OB
    //       longFundingRate: fundingRate.mulFN(FixedNumber.fromString('-1')),
    //       shortFundingRate: fundingRate,
    //       longBorrowRate: ZERO_FN,
    //       shortBorrowRate: ZERO_FN
    //     })
    //   })
    // } else {
    // get from CoingeckoStats Api
    const sTimeCS = getStaleTime(CACHE_SECOND * 10, opts)
    const cgStats = await aevoCacheGetCoingeckoStats(this.publicApi, sTimeCS, sTimeCS * CACHE_TIME_MULT, opts)

    for (let i = 0; i < marketIds.length; i++) {
      const mId = marketIds[i]
      const asset = aevoMarketIdToAsset(mId)
      const cgStat = cgStats.find((cg) => cg.base_currency === asset)

      if (cgStat) {
        const oiToken = FixedNumber.fromString(cgStat.open_interest!)
        const iPrice = FixedNumber.fromString(cgStat.index_price!)
        const oiUsd = oiToken.mulFN(iPrice).divFN(FixedNumber.fromString('2'))
        const fundingRate = FixedNumber.fromString(cgStat.funding_rate!)

        const cachedOB = getAevoWssOrderBook(asset)
        const ob = cachedOB ? cachedOB : await this.publicApi.getOrderbook(`${asset}-PERP`)

        let bids = ob.bids!
        let asks = ob.asks!

        bids = bids.slice(0, aevoIndexBasisSlippage(bids, LIQUIDITY_SLIPPAGE))
        asks = asks.slice(0, aevoIndexBasisSlippage(asks, LIQUIDITY_SLIPPAGE))

        // long liquidity is the total available asks (sell orders) in the book
        const longLiquidity = asks.reduce((acc, ask) => {
          return addFN(acc, mulFN(FixedNumber.fromString(ask[0]), FixedNumber.fromString(ask[1])))
        }, ZERO_FN)
        // short liquidity is the total available bids (buy orders) in the book
        const shortLiquidity = bids.reduce((acc, bid) => {
          return addFN(acc, mulFN(FixedNumber.fromString(bid[0]), FixedNumber.fromString(bid[1])))
        }, ZERO_FN)

        dynamicMarketMetadata.push({
          oiLong: oiUsd,
          oiShort: oiUsd,
          availableLiquidityLong: longLiquidity,
          availableLiquidityShort: shortLiquidity,
          longFundingRate: fundingRate.mulFN(FixedNumber.fromString('-1')),
          shortFundingRate: fundingRate,
          longBorrowRate: ZERO_FN,
          shortBorrowRate: ZERO_FN
        })
      } else {
        throw new Error(`No stats found for asset ${asset}`)
      }
    }

    return dynamicMarketMetadata
  }

  async increasePosition(orderData: CreateOrder[], wallet: string, opts?: ApiOpts | undefined): Promise<ActionParam[]> {
    const payload: ActionParam[] = []

    // this assumes agent is created on f/e
    this._setCredentials(opts, true)

    for (const each of orderData) {
      // check if selected token is USDC
      if (each.collateral.symbol !== AEVO_COLLATERAL_TOKEN.symbol) throw new Error('token not supported')

      // ensure size delta is in token terms
      if (!each.sizeDelta.isTokenAmount) throw new Error('size delta required in token terms')

      // get market info
      // cached unless opts has bypass cache
      const marketInfo = (await this.getMarketsInfo([each.marketId], opts))[0]

      const coin = marketInfo.indexToken.symbol
      const asset = AEVO_TOKENS_MAP[coin]

      // TODO: handle mode specific stuff when isolated is added,
      const mode = each.mode

      const isBuy = each.direction === 'LONG'
      const slippage = each.slippage ? each.slippage / 100 : 0.01

      const price = Number((await this.getMarketPrices([each.marketId], opts))[0]._value)

      let limitPrice = 0
      let limitPriceN = 0

      if (each.type == 'MARKET') {
        limitPrice = to6Decimals(toNearestTick(slippagePrice(isBuy, slippage, price), Number(marketInfo.priceStep)))
        limitPriceN = slippagePrice(isBuy, slippage, price)
      } else {
        if (!each.triggerData) throw new Error('trigger data required for limit increase')
        limitPrice = to6Decimals(
          toNearestTick(Number(each.triggerData.triggerPrice._value), Number(marketInfo.priceStep))
        )
        limitPriceN = Number(each.triggerData.triggerPrice._value)
      }

      // calculate leverage using sizeDelta and marginDelta
      const sizeDelta = toNearestTick(Number(each.sizeDelta.amount._value), Number(marketInfo.amountStep))
      const marginDelta = Number(each.marginDelta.amount._value)

      const reqdLeverage = getReqdLeverage(sizeDelta, marginDelta, limitPriceN)

      const aevoParams: AvailableToTradeParams<'AEVO'> = undefined

      const availableToTrade = Number(
        (await this.getAvailableToTrade(wallet, aevoParams as AvailableToTradeParams<this['protocolId']>, opts)).amount
          ._value
      )

      // TODO: add check that reqdLeverage > currentLeverage if there is open position (after market state is added)
      // TODO: change margin mode when implementing isolated

      if (availableToTrade < marginDelta) throw new Error('not enough available margin')

      if (each.tif === 'ALO') throw new Error('ALO not supported')

      payload.push(updateAevoLeverage(this, { instrument: Number(asset.instrumentId), leverage: reqdLeverage }))

      const request: NonNullable<Parameters<AevoAdapterV1['privateApi']['postOrders']>[0]> = {
        instrument: Number(asset.instrumentId),
        maker: wallet,
        is_buy: isBuy,
        amount: to6Decimals(sizeDelta).toString(),
        limit_price: limitPrice.toString(),
        salt: '', // will be filled internally
        signature: '', // will be filled internally
        timestamp: '', // will be filled internally
        post_only: false,
        reduce_only: false,
        time_in_force: each.tif ? (each.tif === 'GTC' ? time_in_force.GTC : time_in_force.IOC) : time_in_force.GTC
      }

      payload.push(signCreateOrder(this, request))
    }

    return payload
  }

  updateOrder(orderData: UpdateOrder[], wallet: string, opts?: ApiOpts | undefined): Promise<ActionParam[]> {
    throw new Error('Method not implemented.')
  }

  cancelOrder(orderData: CancelOrder[], wallet: string, opts?: ApiOpts | undefined): Promise<ActionParam[]> {
    throw new Error('Method not implemented.')
  }

  closePosition(
    positionInfo: PositionInfo[],
    closePositionData: ClosePositionData[],
    wallet: string,
    opts?: ApiOpts | undefined
  ): Promise<ActionParam[]> {
    throw new Error('Method not implemented.')
  }
  updatePositionMargin(
    positionInfo: PositionInfo[],
    updatePositionMarginData: UpdatePositionMarginData[],
    wallet: string,
    opts?: ApiOpts | undefined
  ): Promise<ActionParam[]> {
    throw new Error('Method not implemented.')
  }
  claimFunding(wallet: string, opts?: ApiOpts | undefined): Promise<ActionParam[]> {
    throw new Error('Method not implemented.')
  }
  getIdleMargins(wallet: string, opts?: ApiOpts | undefined): Promise<IdleMarginInfo[]> {
    throw new Error('Method not implemented.')
  }

  async getAllPositions(
    wallet: string,
    pageOptions: PageOptions | undefined,
    opts?: ApiOpts | undefined
  ): Promise<PaginatedRes<PositionInfo>> {
    this._setCredentials(opts, true)
    const positions: PositionInfo[] = []

    const accountDataPromise = this.privateApi.getAccount()
    const accumulatedFundingsPromise = this.privateApi.getAccountAccumulatedFundings()
    const [accountData, accumulatedFundings] = await Promise.all([accountDataPromise, accumulatedFundingsPromise])

    const leverages = accountData.leverages!

    for (let i = 0; i < accountData.positions!.length; i++) {
      const pos = accountData.positions![i]
      const marketId = encodeMarketId(aevo.id.toString(), this.protocolId, pos.asset)
      const posSize = FixedNumber.fromString(pos.amount)
      const posNtl = posSize.mulFN(FixedNumber.fromString(pos.mark_price))
      const leverage = FixedNumber.fromString(leverages.find((l) => l.instrument_id == pos.instrument_id)!.leverage)
      const marginUsed = posNtl.divFN(leverage)
      const direction = pos.side == 'buy' ? 'LONG' : 'SHORT'

      const accFunding = accumulatedFundings.accumulated_fundings!.find((ac) => ac.instrument_id == pos.instrument_id)
      const fundingFee = accFunding
        ? FixedNumber.fromString(accFunding.accumulated_funding!).mulFN(FixedNumber.fromString('-1'))
        : ZERO_FN
      const rawPnl = FixedNumber.fromString(pos.unrealized_pnl)
      const aggregatePnl = rawPnl.subFN(fundingFee)
      const upnl: PnlData = {
        aggregatePnl: aggregatePnl,
        rawPnl: rawPnl,
        borrowFee: ZERO_FN,
        fundingFee: fundingFee
      }

      const posInfo: PositionInfo = {
        marketId: encodeMarketId(aevo.id.toString(), this.protocolId, pos.asset),
        posId: `${marketId}-${direction}-${accountData.account}`,
        size: toAmountInfoFN(posSize, true),
        margin: toAmountInfoFN(marginUsed, false),
        accessibleMargin: toAmountInfoFN(ZERO_FN, false), // TODO - accessibleMargin for isolated positions when those get enabled
        avgEntryPrice: FixedNumber.fromString(pos.avg_entry_price),
        cumulativeFunding: fundingFee,
        unrealizedPnl: upnl,
        liquidationPrice: pos.liquidation_price ? FixedNumber.fromString(pos.liquidation_price) : ZERO_FN,
        leverage: leverage,
        direction: direction,
        collateral: AEVO_COLLATERAL_TOKEN,
        indexToken: AEVO_TOKENS_MAP[pos.asset],
        protocolId: this.protocolId,
        roe: aggregatePnl.divFN(marginUsed),
        mode: pos.margin_type == 'CROSS' ? 'CROSS' : 'ISOLATED',
        metadata: pos
      }

      positions.push(posInfo)
    }

    return getPaginatedResponse(positions, pageOptions)
  }

  async getAllOrders(
    wallet: string,
    pageOptions: PageOptions | undefined,
    opts?: ApiOpts | undefined
  ): Promise<PaginatedRes<OrderInfo>> {
    this._setCredentials(opts, true)
    const ordersInfo: OrderInfo[] = []

    const ordersDataPromise = this.privateApi.getOrders()
    const accountDataPromise = this.privateApi.getAccount()

    const [ordersData, accountData] = await Promise.all([ordersDataPromise, accountDataPromise])
    const leverages = accountData.leverages!

    for (let i = 0; i < ordersData.length; i++) {
      const od = ordersData[i]
      const pos = accountData.positions?.find(
        (p) => p.triggers?.stop_loss?.order_id === od.order_id || p.triggers?.take_profit?.order_id === od.order_id
      )
      const asset = aevoInstrumentNameToAsset(od.instrument_name)

      let orderType: OrderType
      if (od.order_type == 'limit') {
        if (od.stop) {
          orderType = od.stop == 'STOP_LOSS' ? 'STOP_LOSS_LIMIT' : 'TAKE_PROFIT_LIMIT'
        } else {
          orderType = 'LIMIT'
        }
      } else {
        orderType = od.stop!
      }

      const isStopOrder = orderType != 'LIMIT'
      // for consistency with hyperliquid order direction of close position is same as position direction
      const direction = isStopOrder ? (od.side == 'buy' ? 'SHORT' : 'LONG') : od.side == 'buy' ? 'LONG' : 'SHORT'
      const orderAmount = FixedNumber.fromString(od.amount)
      const sizeDelta = pos && od.close_position ? FixedNumber.fromString(pos.amount) : orderAmount

      const tradeData: TradeData = {
        marketId: encodeMarketId(aevo.id.toString(), this.protocolId, asset),
        direction: direction,
        sizeDelta: toAmountInfoFN(sizeDelta, true),
        marginDelta: toAmountInfoFN(FixedNumber.fromString(od.initial_margin || '0'), false)
      }

      let triggerPrice = ZERO_FN
      let triggerAboveThreshold = false
      let triggerLimitPrice = undefined
      switch (orderType) {
        case 'LIMIT':
          triggerPrice = FixedNumber.fromString(od.price)
          triggerAboveThreshold = direction == 'SHORT'
          break
        case 'STOP_LOSS':
          triggerPrice = FixedNumber.fromString(od.trigger!)
          triggerAboveThreshold = direction == 'SHORT'
          break
        case 'TAKE_PROFIT':
          triggerPrice = FixedNumber.fromString(od.trigger!)
          triggerAboveThreshold = direction == 'LONG'
          break
        case 'STOP_LOSS_LIMIT':
          triggerPrice = FixedNumber.fromString(od.trigger!)
          triggerLimitPrice = FixedNumber.fromString(od.price)
          triggerAboveThreshold = direction == 'SHORT'
          break
        case 'TAKE_PROFIT_LIMIT':
          triggerPrice = FixedNumber.fromString(od.trigger!)
          triggerLimitPrice = FixedNumber.fromString(od.price)
          triggerAboveThreshold = direction == 'LONG'
          break
      }
      const triggerData: TriggerData = {
        triggerPrice,
        triggerAboveThreshold,
        triggerLimitPrice
      }

      const orderData: OrderInfo = {
        ...tradeData,
        mode: leverages.find((l) => l.instrument_id == od.instrument_id)!.margin_type,
        triggerData: triggerData,
        marketId: encodeMarketId(aevo.id.toString(), this.protocolId, asset),
        orderId: od.order_id,
        orderType,
        collateral: AEVO_COLLATERAL_TOKEN,
        protocolId: this.protocolId,
        tif: 'GTC'
      }

      ordersInfo.push(orderData)
    }

    return getPaginatedResponse(ordersInfo, pageOptions)
  }

  async getAllOrdersForPosition(
    wallet: string,
    positionInfo: PositionInfo[],
    pageOptions: PageOptions | undefined,
    opts?: ApiOpts | undefined
  ): Promise<Record<string, PaginatedRes<OrderInfo>>> {
    const allOrders = (await this.getAllOrders(wallet, undefined, opts)).result
    const ordersForPositionInternal: Record<string, OrderInfo[]> = {}

    for (const o of allOrders) {
      for (const p of positionInfo) {
        if (o.marketId === p.marketId) {
          if (ordersForPositionInternal[p.posId] === undefined) {
            ordersForPositionInternal[p.posId] = []
          }
          ordersForPositionInternal[p.posId].push(o)
        }
      }
    }

    const ordersForPosition: Record<string, PaginatedRes<OrderInfo>> = {}
    for (const posId of Object.keys(ordersForPositionInternal)) {
      ordersForPosition[posId] = getPaginatedResponse(ordersForPositionInternal[posId], pageOptions)
    }

    return ordersForPosition
  }

  getTradesHistory(
    wallet: string,
    pageOptions: PageOptions | undefined,
    opts?: ApiOpts | undefined
  ): Promise<PaginatedRes<HistoricalTradeInfo>> {
    throw new Error('Method not implemented.')
  }
  getLiquidationHistory(
    wallet: string,
    pageOptions: PageOptions | undefined,
    opts?: ApiOpts | undefined
  ): Promise<PaginatedRes<LiquidationInfo>> {
    throw new Error('Method not implemented.')
  }
  getClaimHistory(
    wallet: string,
    pageOptions: PageOptions | undefined,
    opts?: ApiOpts | undefined
  ): Promise<PaginatedRes<ClaimInfo>> {
    throw new Error('Method not implemented.')
  }

  async getOpenTradePreview(
    wallet: string,
    orderData: CreateOrder[],
    existingPos: (PositionInfo | undefined)[],
    opts?: ApiOpts | undefined
  ): Promise<OpenTradePreviewInfo[]> {
    // making strict false for autorouter compatibility
    this._setCredentials(opts, false)

    const isCredentialsSet = opts?.aevoAuth?.apiKey && opts?.aevoAuth?.secret
    const previewsInfo: OpenTradePreviewInfo[] = []

    const marketPricesPromise = this.getMarketPrices(
      orderData.map((od) => od.marketId),
      opts
    )
    const sTimeAccount = getStaleTime(CACHE_SECOND * 3, opts)
    const acountDataPromise = isCredentialsSet
      ? aevoCacheGetAccount(this.privateApi, sTimeAccount, sTimeAccount * CACHE_TIME_MULT, opts)
      : Promise.resolve(undefined)

    const [marketPrices, accountData] = await Promise.all([marketPricesPromise, acountDataPromise])

    for (let i = 0; i < orderData.length; i++) {
      const od = orderData[i]
      const pos = existingPos[i]
      const asset = aevoMarketIdToAsset(od.marketId)
      const actPos = pos
        ? (pos.metadata as NonNullable<
            Awaited<ReturnType<(typeof AevoClient)['prototype']['privateApi']['getAccount']>>['positions']
          >[0])
        : undefined
      const isPreLaunch = AEVO_TOKENS_MAP[asset].isPreLaunch
      const mp = marketPrices[i]

      if (!validDenomination(od.sizeDelta, true)) throw new Error(SIZE_DENOMINATION_TOKEN)
      if (!validDenomination(od.marginDelta, false)) throw new Error(MARGIN_DENOMINATION_USD)

      if (pos && pos.mode !== od.mode) throw new Error(CANNOT_CHANGE_MODE)

      const isMarket = od.type == 'MARKET'
      const orderSize = od.sizeDelta.amount
      const trigPrice = isMarket ? mp : od.triggerData!.triggerPrice

      const actPosSize = actPos ? FixedNumber.fromString(actPos.amount) : ZERO_FN
      const actPosAvgEntryPrice = actPos ? FixedNumber.fromString(actPos.avg_entry_price) : ZERO_FN

      const lev = FixedNumber.fromString(getReqdLeverageFN(orderSize, od.marginDelta.amount, trigPrice).toString())
      const curLev = pos ? pos.leverage : ZERO_FN
      if (pos && lev.lt(curLev)) throw new Error(LEV_OUT_OF_BOUNDS)

      const nextSize = pos
        ? pos.direction === od.direction
          ? actPosSize.addFN(orderSize).abs()
          : actPosSize.subFN(orderSize).abs()
        : orderSize

      // get fees for the user
      const { takerFee, makerFee } = this._getFee(isPreLaunch, asset, accountData)

      // traverseOrderBook for market orders
      let traResult: TraverseResult | undefined = undefined
      if (isMarket) {
        const cachedOB = getAevoWssOrderBook(asset)
        const sTimeOB = getStaleTime(CACHE_SECOND * 5, opts)
        const ob = cachedOB
          ? cachedOB
          : await aevoCacheGetOrderbook(asset, this.publicApi, sTimeOB, sTimeOB * CACHE_TIME_MULT, opts)

        traResult = traverseAevoBook(od.direction == 'LONG' ? ob.asks! : ob.bids!, orderSize, mp, takerFee)
        // console.log('TRAVERSE RESULT', traResult)
      }

      // next margin is always position / leverage
      const nextMargin = nextSize.mulFN(trigPrice).divFN(lev)

      const nextEntryPrice = isMarket ? traResult!.avgExecPrice : trigPrice
      let avgEntryPrice = nextEntryPrice
      let nextDirection = od.direction
      if (actPos && pos) {
        if (pos.direction === od.direction) {
          // average entry price
          // posSize * posEntryPrice + orderSize * orderEntryPrice / (posSize + orderSize)
          avgEntryPrice = actPosSize.mulFN(actPosAvgEntryPrice).addFN(orderSize.mulFN(nextEntryPrice)).divFN(nextSize)
        } else {
          if (actPosSize.gt(orderSize)) {
            // partial close would result in previous entry price
            avgEntryPrice = actPosAvgEntryPrice
            // direction would be same as position
            nextDirection = pos.direction
          } else {
            // direction would change and hence newer entry price would be the avgEntryprice
            avgEntryPrice = nextEntryPrice
          }
        }
      }

      // if accountData is not set return liqPrice as 0 so that it is autorouter compatible
      let liqPrice = ZERO_FN
      if (accountData) {
        const floatSide = FixedNumber.fromString(nextDirection == 'LONG' ? '1' : '-1')
        const mmRatio = isPreLaunch ? AEVO_PRE_LAUNCH_MM : AEVO_NORMAL_MM
        let cumMargin = ZERO_FN
        for (const col of accountData.collaterals!) {
          cumMargin = cumMargin.addFN(FixedNumber.fromString(col.margin_value))
        }
        const posPnl = actPos ? FixedNumber.fromString(actPos.unrealized_pnl) : ZERO_FN
        const accMM = FixedNumber.fromString(accountData.maintenance_margin)
        const posMM = actPos ? actPosSize.mulFN(actPosAvgEntryPrice).mul(mmRatio) : ZERO_FN
        const nextPosMM = nextSize.mulFN(avgEntryPrice).mul(mmRatio)

        liqPrice = trigPrice.subFN(
          cumMargin
            .addFN(posPnl) // add pnl
            .subFN(accMM.subFN(posMM).add(nextPosMM)) // subtract adjusted MM
            .divFN(nextSize) // divide by next size
            .mulFN(floatSide) // adjust sign
        )
        liqPrice = liqPrice.lt(ZERO_FN) ? ZERO_FN : liqPrice
        // console.log('Liq Price from AV: ', liqPrice)
      }

      const fee = isMarket ? traResult!.fees : orderSize.mulFN(trigPrice).mulFN(makerFee)
      const priceImpact = isMarket ? traResult!.priceImpact : ZERO_FN

      const preview = {
        marketId: od.marketId,
        collateral: od.collateral,
        leverage: lev,
        size: toAmountInfoFN(nextSize, true),
        margin: toAmountInfoFN(nextMargin, false),
        avgEntryPrice: avgEntryPrice,
        liqudationPrice: liqPrice,
        fee: fee,
        priceImpact: priceImpact,
        isError: false,
        errMsg: ''
      }

      previewsInfo.push(preview)
    }

    return previewsInfo
  }

  async getCloseTradePreview(
    wallet: string,
    positionInfo: PositionInfo[],
    closePositionData: ClosePositionData[],
    opts?: ApiOpts | undefined
  ): Promise<CloseTradePreviewInfo[]> {
    const previewsInfo: CloseTradePreviewInfo[] = []

    this._setCredentials(opts, true)

    const marketPricesPromise = this.getMarketPrices(
      positionInfo.map((pos) => pos.marketId),
      opts
    )
    const sTimeAccount = getStaleTime(CACHE_SECOND * 3, opts)
    const acountDataPromise = aevoCacheGetAccount(this.privateApi, sTimeAccount, sTimeAccount * CACHE_TIME_MULT, opts)

    const [marketPrices, accountData] = await Promise.all([marketPricesPromise, acountDataPromise])

    for (let i = 0; i < positionInfo.length; i++) {
      const pos = positionInfo[i]
      const cpd = closePositionData[i]
      const asset = aevoMarketIdToAsset(pos.marketId)
      const actPos = pos.metadata as ActualPosition
      const isPreLaunch = AEVO_TOKENS_MAP[asset].isPreLaunch
      const mp = marketPrices[i]
      const closeSize = cpd.closeSize.amount
      const posSize = pos.size.amount
      const isMarket = cpd.type == 'MARKET'
      const isSpTlLimit = cpd.type == 'STOP_LOSS_LIMIT' || cpd.type == 'TAKE_PROFIT_LIMIT'
      const trigPrice = isMarket
        ? mp
        : isSpTlLimit
        ? cpd.triggerData!.triggerLimitPrice!
        : cpd.triggerData!.triggerPrice
      const ml = pos.leverage
      const isCross = pos.mode == 'CROSS'

      if (!validDenomination(cpd.closeSize, true)) throw new Error(SIZE_DENOMINATION_TOKEN)

      // get fees for the user
      const { takerFee, makerFee } = this._getFee(isPreLaunch, asset, accountData)

      // traverseOrderBook for market orders in opposite direction to position
      let traResult: TraverseResult | undefined = undefined
      if (isMarket) {
        const cachedOB = getAevoWssOrderBook(asset)
        const sTimeOB = getStaleTime(CACHE_SECOND * 5, opts)
        const ob = cachedOB
          ? cachedOB
          : await aevoCacheGetOrderbook(asset, this.publicApi, sTimeOB, sTimeOB * CACHE_TIME_MULT, opts)

        traResult = !closeSize.isZero()
          ? traverseAevoBook(pos.direction == 'LONG' ? ob.bids! : ob.asks!, closeSize, mp, takerFee)
          : {
              avgExecPrice: mp,
              fees: ZERO_FN,
              priceImpact: ZERO_FN,
              remainingSize: ZERO_FN
            }
      }

      // fee for tp/sl order is calculated basis the trigger price (ignoring the slippage accurred)
      let fee = isMarket
        ? traResult!.fees
        : isSpTlLimit
        ? closeSize.mulFN(trigPrice).mulFN(makerFee)
        : closeSize.mulFN(trigPrice).mulFN(takerFee)

      const remainingSize = posSize.subFN(closeSize)
      const marginReqByPos = remainingSize.mulFN(trigPrice).divFN(ml)
      // const proportionalAccessibleMargin = remainingSize.divFN(posSize).mulFN(pos.accessibleMargin.amount)
      // const proportionalUpnl = remainingSize.divFN(posSize).mulFN(pos.unrealizedPnl.rawPnl)
      // const remainingMargin = marginReqByPos.addFN(proportionalAccessibleMargin).addFN(proportionalUpnl)
      // const freedMargin = pos.margin.amount.subFN(remainingMargin)
      const pnl = closeSize.mulFN(trigPrice.subFN(pos.avgEntryPrice))
      // const receiveMargin = isCross ? ZERO_FN : freedMargin.addFN(pnl)

      let liqPrice = ZERO_FN
      if (accountData) {
        const floatSide = FixedNumber.fromString(pos.direction == 'LONG' ? '1' : '-1')
        const mmRatio = isPreLaunch ? AEVO_PRE_LAUNCH_MM : AEVO_NORMAL_MM
        let cumMargin = ZERO_FN
        for (const col of accountData.collaterals!) {
          cumMargin = cumMargin.addFN(FixedNumber.fromString(col.margin_value))
        }
        const accMM = FixedNumber.fromString(accountData.maintenance_margin)
        const posMM = actPos ? posSize.mulFN(pos.avgEntryPrice).mul(mmRatio) : ZERO_FN
        const nextPosMM = remainingSize.mulFN(pos.avgEntryPrice).mul(mmRatio)

        liqPrice = trigPrice.subFN(
          cumMargin
            .addFN(pnl) // add closed pnl at trig price
            .subFN(accMM.subFN(posMM).add(nextPosMM)) // subtract adjusted MM
            .divFN(remainingSize) // divide by next size
            .mulFN(floatSide) // adjust sign
        )
        liqPrice = liqPrice.lt(ZERO_FN) ? ZERO_FN : liqPrice
        // console.log('Liq Price from AV: ', liqPrice)
      }

      const preview: CloseTradePreviewInfo = {
        marketId: pos.marketId,
        collateral: pos.collateral,
        leverage: remainingSize.isZero() ? ZERO_FN : ml,
        size: toAmountInfoFN(remainingSize, true),
        margin: /* isCross ?  */ toAmountInfoFN(marginReqByPos, true) /* : toAmountInfoFN(remainingMargin, true) */,
        avgEntryPrice: pos.avgEntryPrice,
        liqudationPrice: liqPrice,
        fee: fee,
        // receiveMargin: receiveMargin.gt(ZERO_FN) ? toAmountInfoFN(receiveMargin, true) : toAmountInfoFN(ZERO_FN, true),
        receiveMargin: toAmountInfoFN(ZERO_FN, true),
        isError: false,
        errMsg: ''
      }
      // console.log(preview)

      previewsInfo.push(preview)
    }

    return previewsInfo
  }

  // Only possible in isolated positions
  getUpdateMarginPreview(
    wallet: string,
    isDeposit: boolean[],
    marginDelta: AmountInfo[],
    existingPos: PositionInfo[],
    opts?: ApiOpts | undefined
  ): Promise<PreviewInfo[]> {
    throw new Error('Method not implemented.')
  }

  getTotalClaimableFunding(wallet: string, opts?: ApiOpts | undefined): Promise<FixedNumber> {
    throw new Error('Method not implemented.')
  }
  getTotalAccuredFunding(wallet: string, opts?: ApiOpts | undefined): Promise<FixedNumber> {
    throw new Error('Method not implemented.')
  }

  async getAccountInfo(wallet: string, opts?: ApiOpts | undefined): Promise<AccountInfo[]> {
    this._setCredentials(opts, true)

    const sTimeAccount = getStaleTime(CACHE_SECOND * 3, opts)
    const accountInfo = await aevoCacheGetAccount(this.privateApi, sTimeAccount, sTimeAccount * CACHE_TIME_MULT, opts)

    const maintainenceMarginUsed = FixedNumber.fromString(accountInfo.maintenance_margin)
    const initialMarginUsed = FixedNumber.fromString(accountInfo.initial_margin)
    const equity = FixedNumber.fromString(accountInfo.equity)
    const availableBalance = FixedNumber.fromString(accountInfo.available_balance)
    const mmUtilizationPercent = maintainenceMarginUsed.divFN(equity).mulFN(FixedNumber.fromString('100'))
    const imUtilizationPercent = initialMarginUsed
      .addFN(maintainenceMarginUsed)
      .divFN(equity)
      .mulFN(FixedNumber.fromString('100'))

    return Promise.resolve([
      {
        protocolId: this.protocolId,
        accountInfoData: {
          imUtilizationPercent: imUtilizationPercent,
          mmUtilizationPercent: mmUtilizationPercent,
          initialMarginUsed: initialMarginUsed,
          maintainenceMarginUsed: maintainenceMarginUsed,
          equityBalance: equity,
          availableBalance: availableBalance,
          storedCollateral: accountInfo.collaterals
        }
      }
    ])
  }

  getMarketState(wallet: string, marketIds: string[], opts?: ApiOpts | undefined): Promise<MarketState[]> {
    throw new Error('Method not implemented.')
  }

  async getOrderBooks(
    marketIds: string[],
    precision: (number | undefined)[], // not supported in aevo as of now
    opts?: ApiOpts | undefined
  ): Promise<OrderBook[]> {
    const orderBooks: OrderBook[] = []

    for (let i = 0; i < marketIds.length; i++) {
      const mId = marketIds[i]
      const asset = aevoMarketIdToAsset(mId)
      const defPre = 1 // Hardcode to 1 aevo only supports 1 precision

      const precisionOBData: Record<number, OBData> = {}
      const actualPrecisionsMap: Record<number, FixedNumber> = {}

      let aevoOb = getAevoWssOrderBook(asset)
      aevoOb = aevoOb ? aevoOb : await this.publicApi.getOrderbook(`${asset}-PERP`)
      const obData = aevoMapAevoObToObData(aevoOb)
      precisionOBData[defPre] = obData // only 1 precision allowed in aevo
      actualPrecisionsMap[defPre] = obData.actualPrecision

      orderBooks.push({
        marketId: mId,
        precisionOBData: defPre ? { [defPre]: precisionOBData[defPre] } : precisionOBData,
        actualPrecisionsMap: actualPrecisionsMap
      })
    }

    return orderBooks
  }

  /// Internal helper functions ///
  // to pass opts to set keys from local storage
  // should be set where private apis are used
  _setCredentials(opts: ApiOpts | undefined, strict: boolean) {
    if (opts && opts.aevoAuth) {
      this.aevoClient.setCredentials(opts.aevoAuth.apiKey, opts.aevoAuth.secret)
    }

    if (strict && (!this.aevoClient.headers['AEVO-KEY'] || !this.aevoClient.headers['AEVO-SECRET'])) {
      throw new Error('headers not set')
    }
  }

  async _preWarmCache(opts?: ApiOpts) {
    await aevoCacheGetAllMarkets(this.publicApi, 0, 0, opts)
    await aevoCacheGetCoingeckoStats(this.publicApi, 0, 0, opts)
    await aevoCacheGetAllAssets(this.publicApi, 0, 0, opts)

    if (opts && opts.aevoAuth) {
      this.aevoClient.setCredentials(opts.aevoAuth.apiKey, opts.aevoAuth.secret)
      await aevoCacheGetAccount(this.privateApi, 0, 0, opts)
    }
  }

  _getFee(
    isPreLaunch: boolean,
    asset: string,
    accountData: AccountData | undefined
  ): {
    takerFee: FixedNumber
    makerFee: FixedNumber
  } {
    // get default fees
    const defaultTakerFee = isPreLaunch ? AEVO_DEFAULT_TAKER_FEE_PRE_LAUNCH : AEVO_DEFAULT_TAKER_FEE
    const defaultMakerFee = isPreLaunch ? AEVO_DEFAULT_MAKER_FEE_PRE_LAUNCH : AEVO_DEFAULT_MAKER_FEE
    let takerFee = FixedNumber.fromString(AEVO_FEE_MAP[asset].taker_fee || defaultTakerFee)
    let makerFee = FixedNumber.fromString(AEVO_FEE_MAP[asset].maker_fee || defaultMakerFee)
    // get fees from account data if available
    if (accountData) {
      const feeStruct = accountData.fee_structures?.find((f) => f.asset == asset && f.instrument_type == 'PERPETUAL')
      if (feeStruct) {
        takerFee = FixedNumber.fromString(feeStruct.taker_fee)
        makerFee = FixedNumber.fromString(feeStruct.maker_fee)
      }
    }

    return {
      takerFee,
      makerFee
    }
  }
}
