/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface UniPoolInterface extends ethers.utils.Interface {
  functions: {
    "observe(uint32[])": FunctionFragment;
    "slot0()": FunctionFragment;
    "tickSpacing()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "observe",
    values: [BigNumberish[]]
  ): string;
  encodeFunctionData(functionFragment: "slot0", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tickSpacing",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "observe", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "slot0", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tickSpacing",
    data: BytesLike
  ): Result;

  events: {};
}

export class UniPool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: UniPoolInterface;

  functions: {
    observe(
      arg0: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], BigNumber[]] & {
        tickCumulatives: BigNumber[];
        secondsPerLiquidityCumulativeX128s: BigNumber[];
      }
    >;

    slot0(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, number, number, number, boolean] & {
        sqrtPriceX96: BigNumber;
        tick: number;
        observationIndex: number;
        observationCardinality: number;
        observationCardinalityNext: number;
        feeProtocol: number;
        unlocked: boolean;
      }
    >;

    tickSpacing(overrides?: CallOverrides): Promise<[number]>;
  };

  observe(
    arg0: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<
    [BigNumber[], BigNumber[]] & {
      tickCumulatives: BigNumber[];
      secondsPerLiquidityCumulativeX128s: BigNumber[];
    }
  >;

  slot0(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number, number, number, number, boolean] & {
      sqrtPriceX96: BigNumber;
      tick: number;
      observationIndex: number;
      observationCardinality: number;
      observationCardinalityNext: number;
      feeProtocol: number;
      unlocked: boolean;
    }
  >;

  tickSpacing(overrides?: CallOverrides): Promise<number>;

  callStatic: {
    observe(
      arg0: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<
      [BigNumber[], BigNumber[]] & {
        tickCumulatives: BigNumber[];
        secondsPerLiquidityCumulativeX128s: BigNumber[];
      }
    >;

    slot0(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number, number, number, number, boolean] & {
        sqrtPriceX96: BigNumber;
        tick: number;
        observationIndex: number;
        observationCardinality: number;
        observationCardinalityNext: number;
        feeProtocol: number;
        unlocked: boolean;
      }
    >;

    tickSpacing(overrides?: CallOverrides): Promise<number>;
  };

  filters: {};

  estimateGas: {
    observe(
      arg0: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    slot0(overrides?: CallOverrides): Promise<BigNumber>;

    tickSpacing(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    observe(
      arg0: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    slot0(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tickSpacing(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
