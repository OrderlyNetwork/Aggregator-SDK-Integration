/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Multicall3,
  Multicall3Interface,
} from "../../../contracts/mock/Multicall3";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "returnData",
        type: "bytes[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bool",
            name: "allowFailure",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call3[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate3",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bool",
            name: "allowFailure",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call3Value[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate3Value",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "blockAndAggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBasefee",
    outputs: [
      {
        internalType: "uint256",
        name: "basefee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBlockNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "chainid",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockCoinbase",
    outputs: [
      {
        internalType: "address",
        name: "coinbase",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockGasLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "gaslimit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "requireSuccess",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "tryAggregate",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "requireSuccess",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "tryBlockAndAggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall3.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610c44806100206000396000f3fe6080604052600436106100b85760003560e01c80630f28c97d146100bd578063174dea71146100df578063252dba42146100ff57806327e86d6e146101205780633408e47014610138578063399542e91461014b5780633e64a6961461016d57806342cbb15c146101805780634d2301cc1461019357806382ad56cb146101bb57806386d516e8146101ce578063a8b0574e146101e1578063bce38bd7146101fc578063c3077fa91461020f578063ee82ac5e14610222575b600080fd5b3480156100c957600080fd5b50425b6040519081526020015b60405180910390f35b6100f26100ed3660046108d3565b610241565b6040516100d691906109c8565b61011261010d3660046108d3565b61041e565b6040516100d69291906109e2565b34801561012c57600080fd5b504360001901406100cc565b34801561014457600080fd5b50466100cc565b61015e610159366004610a4c565b610567565b6040516100d693929190610aa5565b34801561017957600080fd5b50486100cc565b34801561018c57600080fd5b50436100cc565b34801561019f57600080fd5b506100cc6101ae366004610acd565b6001600160a01b03163190565b6100f26101c93660046108d3565b610582565b3480156101da57600080fd5b50456100cc565b3480156101ed57600080fd5b506040514181526020016100d6565b6100f261020a366004610a4c565b6106f6565b61015e61021d3660046108d3565b610851565b34801561022e57600080fd5b506100cc61023d366004610af6565b4090565b6060600082806001600160401b0381111561025e5761025e610b0f565b60405190808252806020026020018201604052801561029757816020015b610284610870565b81526020019060019003908161027c5790505b5092503660005b828110156103c35760008582815181106102ba576102ba610b25565b602002602001015190508787838181106102d6576102d6610b25565b90506020028101906102e89190610b3b565b6040810135958601959093506103016020850185610acd565b6001600160a01b0316816103186060870187610b5b565b604051610326929190610ba1565b60006040518083038185875af1925050503d8060008114610363576040519150601f19603f3d011682016040523d82523d6000602084013e610368565b606091505b5060208085019190915290151580845290850135176103b95762461bcd60e51b6000526020600452601760245276135d5b1d1a58d85b1b0cce8818d85b1b0819985a5b1959604a1b60445260846000fd5b505060010161029e565b508234146104155760405162461bcd60e51b815260206004820152601a60248201527909aead8e8d2c6c2d8d8667440ecc2d8eaca40dad2e6dac2e8c6d60331b60448201526064015b60405180910390fd5b50505092915050565b43606082806001600160401b0381111561043a5761043a610b0f565b60405190808252806020026020018201604052801561046d57816020015b60608152602001906001900390816104585790505b5091503660005b8281101561055d57600087878381811061049057610490610b25565b90506020028101906104a29190610bb1565b92506104b16020840184610acd565b6001600160a01b03166104c76020850185610b5b565b6040516104d5929190610ba1565b6000604051808303816000865af19150503d8060008114610512576040519150601f19603f3d011682016040523d82523d6000602084013e610517565b606091505b5086848151811061052a5761052a610b25565b60209081029190910101529050806105545760405162461bcd60e51b815260040161040c90610bc7565b50600101610474565b5050509250929050565b43804060606105778686866106f6565b905093509350939050565b606081806001600160401b0381111561059d5761059d610b0f565b6040519080825280602002602001820160405280156105d657816020015b6105c3610870565b8152602001906001900390816105bb5790505b5091503660005b828110156104155760008482815181106105f9576105f9610b25565b6020026020010151905086868381811061061557610615610b25565b90506020028101906106279190610bf8565b92506106366020840184610acd565b6001600160a01b031661064c6040850185610b5b565b60405161065a929190610ba1565b6000604051808303816000865af19150503d8060008114610697576040519150601f19603f3d011682016040523d82523d6000602084013e61069c565b606091505b5060208084019190915290151580835290840135176106ed5762461bcd60e51b6000526020600452601760245276135d5b1d1a58d85b1b0cce8818d85b1b0819985a5b1959604a1b60445260646000fd5b506001016105dd565b606081806001600160401b0381111561071157610711610b0f565b60405190808252806020026020018201604052801561074a57816020015b610737610870565b81526020019060019003908161072f5790505b5091503660005b8281101561084757600084828151811061076d5761076d610b25565b6020026020010151905086868381811061078957610789610b25565b905060200281019061079b9190610bb1565b92506107aa6020840184610acd565b6001600160a01b03166107c06020850185610b5b565b6040516107ce929190610ba1565b6000604051808303816000865af19150503d806000811461080b576040519150601f19603f3d011682016040523d82523d6000602084013e610810565b606091505b50602083015215158152871561083e57805161083e5760405162461bcd60e51b815260040161040c90610bc7565b50600101610751565b5050509392505050565b600080606061086260018686610567565b919790965090945092505050565b60408051808201909152600081526060602082015290565b60008083601f84011261089a57600080fd5b5081356001600160401b038111156108b157600080fd5b6020830191508360208260051b85010111156108cc57600080fd5b9250929050565b600080602083850312156108e657600080fd5b82356001600160401b038111156108fc57600080fd5b61090885828601610888565b90969095509350505050565b6000815180845260005b8181101561093a5760208185018101518683018201520161091e565b506000602082860101526020601f19601f83011685010191505092915050565b600082825180855260208086019550808260051b84010181860160005b848110156109bb57858303601f19018952815180511515845284015160408585018190526109a781860183610914565b9a86019a9450505090830190600101610977565b5090979650505050505050565b6020815260006109db602083018461095a565b9392505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b82811015610a3e57605f19888703018452610a2c868351610914565b95509284019290840190600101610a10565b509398975050505050505050565b600080600060408486031215610a6157600080fd5b83358015158114610a7157600080fd5b925060208401356001600160401b03811115610a8c57600080fd5b610a9886828701610888565b9497909650939450505050565b838152826020820152606060408201526000610ac4606083018461095a565b95945050505050565b600060208284031215610adf57600080fd5b81356001600160a01b03811681146109db57600080fd5b600060208284031215610b0857600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008235607e19833603018112610b5157600080fd5b9190910192915050565b6000808335601e19843603018112610b7257600080fd5b8301803591506001600160401b03821115610b8c57600080fd5b6020019150368190038213156108cc57600080fd5b8183823760009101908152919050565b60008235603e19833603018112610b5157600080fd5b602080825260179082015276135d5b1d1a58d85b1b0cce8818d85b1b0819985a5b1959604a1b604082015260600190565b60008235605e19833603018112610b5157600080fdfea26469706673582212205df1e9f2437d5feed9554be594a0f427b805703efd05baf125941b69b294ee5164736f6c63430008120033";

type Multicall3ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Multicall3ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Multicall3__factory extends ContractFactory {
  constructor(...args: Multicall3ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Multicall3> {
    return super.deploy(overrides || {}) as Promise<Multicall3>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Multicall3 {
    return super.attach(address) as Multicall3;
  }
  override connect(signer: Signer): Multicall3__factory {
    return super.connect(signer) as Multicall3__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Multicall3Interface {
    return new utils.Interface(_abi) as Multicall3Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Multicall3 {
    return new Contract(address, _abi, signerOrProvider) as Multicall3;
  }
}