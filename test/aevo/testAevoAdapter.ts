import { config } from 'dotenv'
import AevoAdapterV1 from '../../src/exchanges/aevo'
import { ApiOpts, CreateOrder } from '../../src/interfaces/V1/IRouterAdapterBaseV1'
import { parseUnits } from 'ethers/lib/utils'
import { toAmountInfoFN } from '../../src/common/helper'
import { HL_COLLATERAL_TOKEN } from '../../src/configs/hyperliquid/api/client'
import { FixedNumber, divFN, mulFN } from '../../src/common/fixedNumber'
import { AEVO_COLLATERAL_TOKEN } from '../../src/configs/aevo/config'

const normalAddress = '0x2f88a09ed4174750a464576FE49E586F90A34820'
const w = normalAddress

const aa = new AevoAdapterV1()

const btcMarketId = '42161-AEVO-BTC'
const ethMarketId = '42161-AEVO-ETH'

config()

const AEVO_KEY = process.env.AEVO_KEY
const SECRET = process.env.SECRET

const aevoPrivateOpts: ApiOpts = {
  bypassCache: false,
  aevoAuth: {
    apiKey: AEVO_KEY!,
    secret: SECRET!
  }
}

async function supportedMarkets() {
  const markets = await aa.supportedMarkets(aa.supportedChains())
  console.dir(markets, { depth: 4 })
}

async function getMarketPrices() {
  const prices = await aa.getMarketPrices([btcMarketId, ethMarketId])
  console.dir(prices, { depth: 4 })
}

async function getMarketsInfo() {
  const info = await aa.getMarketsInfo([btcMarketId, ethMarketId])
  console.dir(info, { depth: 4 })
}

async function getDynamicMarketMetadata() {
  // await aa.setup()
  // const metadata1 = await aa.getDynamicMarketMetadata([btcMarketId /* , ethMarketId */])
  // console.dir(metadata1, { depth: 4 })
  // await delay(2500)
  const metadata = await aa.getDynamicMarketMetadata([btcMarketId /* , ethMarketId */])
  console.dir(metadata, { depth: 4 })
}

async function getAllPositions() {
  const positions = (await aa.getAllPositions('', undefined, aevoPrivateOpts)).result
  console.dir(positions, { depth: 4 })
}

async function getAllOrders() {
  const orders = (await aa.getAllOrders('', undefined, aevoPrivateOpts)).result
  console.dir(orders, { depth: 4 })
}

async function getAccountInfo() {
  const accountInfo = await aa.getAccountInfo('', aevoPrivateOpts)
  console.dir(accountInfo, { depth: 4 })
}

async function getAvailableToTrade() {
  const availableToTrade = await aa.getAvailableToTrade('', undefined, aevoPrivateOpts)
  console.dir(availableToTrade, { depth: 4 })
}

async function getOpenTradePreview() {
  const btcPrice = (await aa.getMarketPrices([btcMarketId], undefined))[0]

  const size = FixedNumber.fromValue(parseUnits('0.005', 18).toString(), 18)
  const lev = FixedNumber.fromString('5')
  const isTrigger = true
  const isLong = true
  const trigPrice = isTrigger ? (isLong ? FixedNumber.fromString('20000') : FixedNumber.fromString('80000')) : btcPrice

  const marginAmount = size.mulFN(trigPrice).divFN(lev)
  // console.log('marginAmount:', marginAmount)
  const sizeUsd = mulFN(marginAmount, lev)
  // console.log('sizeUsd:', sizeUsd)

  const orderData: CreateOrder = {
    marketId: btcMarketId,
    mode: 'CROSS',
    direction: isLong ? 'LONG' : 'SHORT',
    sizeDelta: toAmountInfoFN(size, true),
    marginDelta: toAmountInfoFN(marginAmount, false),
    triggerData: /* undefined */ {
      triggerPrice: trigPrice,
      triggerAboveThreshold: false,
      triggerLimitPrice: undefined
    },
    collateral: AEVO_COLLATERAL_TOKEN,
    type: isTrigger ? 'LIMIT' : 'MARKET',
    slippage: 1
  }

  const positions = (await aa.getAllPositions(w, undefined, aevoPrivateOpts)).result

  const openTradePreview = await aa.getOpenTradePreview(
    w,
    [orderData],
    positions.filter((p) => p.marketId === orderData.marketId),
    aevoPrivateOpts
  )
  console.dir(openTradePreview, { depth: 4 })
}

aa.init(undefined).then(() => {
  delay(2500).then(() => {
    getOpenTradePreview()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
  })
})

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
