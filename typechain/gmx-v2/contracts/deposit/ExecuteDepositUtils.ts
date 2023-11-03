/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface ExecuteDepositUtilsInterface extends utils.Interface {
  functions: {
    "RECEIVER_FOR_FIRST_DEPOSIT()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "RECEIVER_FOR_FIRST_DEPOSIT"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "RECEIVER_FOR_FIRST_DEPOSIT",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "RECEIVER_FOR_FIRST_DEPOSIT",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ExecuteDepositUtils extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ExecuteDepositUtilsInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    RECEIVER_FOR_FIRST_DEPOSIT(overrides?: CallOverrides): Promise<[string]>;
  };

  RECEIVER_FOR_FIRST_DEPOSIT(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    RECEIVER_FOR_FIRST_DEPOSIT(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    RECEIVER_FOR_FIRST_DEPOSIT(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    RECEIVER_FOR_FIRST_DEPOSIT(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}