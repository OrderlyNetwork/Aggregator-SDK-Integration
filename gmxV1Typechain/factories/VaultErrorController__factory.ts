/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  VaultErrorController,
  VaultErrorControllerInterface,
} from "../VaultErrorController";

const _abi = [
  {
    inputs: [],
    name: "gov",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "address",
      },
      {
        internalType: "string[]",
        name: "_errors",
        type: "string[]",
      },
    ],
    name: "setErrors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_gov",
        type: "address",
      },
    ],
    name: "setGov",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b0319163317905561036b806100326000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806312d43a51146100465780636216c01b14610064578063cfad57a214610079575b600080fd5b61004e61008c565b60405161005b9190610259565b60405180910390f35b6100776100723660046101d8565b61009b565b005b6100776100873660046101b5565b610169565b6000546001600160a01b031681565b6000546001600160a01b031633146100ce5760405162461bcd60e51b81526004016100c59061026d565b60405180910390fd5b60005b8181101561016357836001600160a01b03166328e67be5828585858181106100f557fe5b905060200281019061010791906102d2565b6040518463ffffffff1660e01b81526004016101259392919061029c565b600060405180830381600087803b15801561013f57600080fd5b505af1158015610153573d6000803e3d6000fd5b5050600190920191506100d19050565b50505050565b6000546001600160a01b031633146101935760405162461bcd60e51b81526004016100c59061026d565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6000602082840312156101c6578081fd5b81356101d18161031d565b9392505050565b6000806000604084860312156101ec578182fd5b83356101f78161031d565b925060208401356001600160401b0380821115610212578384fd5b818601915086601f830112610225578384fd5b813581811115610233578485fd5b8760208083028501011115610246578485fd5b6020830194508093505050509250925092565b6001600160a01b0391909116815260200190565b60208082526015908201527423b7bb32b93730b136329d103337b93134b23232b760591b604082015260600190565b60008482526040602083015282604083015282846060840137818301606090810191909152601f909201601f1916010192915050565b6000808335601e198436030181126102e8578283fd5b8301803591506001600160401b03821115610301578283fd5b60200191503681900382131561031657600080fd5b9250929050565b6001600160a01b038116811461033257600080fd5b5056fea2646970667358221220a9b2ba73ecae8a04443d2973806dee5c2ac2d222f9bcb9c19b0439e12f9b9b6564736f6c634300060c0033";

export class VaultErrorController__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VaultErrorController> {
    return super.deploy(overrides || {}) as Promise<VaultErrorController>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): VaultErrorController {
    return super.attach(address) as VaultErrorController;
  }
  connect(signer: Signer): VaultErrorController__factory {
    return super.connect(signer) as VaultErrorController__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VaultErrorControllerInterface {
    return new utils.Interface(_abi) as VaultErrorControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VaultErrorController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as VaultErrorController;
  }
}
