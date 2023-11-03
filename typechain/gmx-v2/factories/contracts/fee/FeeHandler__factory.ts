/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  FeeHandler,
  FeeHandlerInterface,
} from "../../../contracts/fee/FeeHandler";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract RoleStore",
        name: "_roleStore",
        type: "address",
      },
      {
        internalType: "contract DataStore",
        name: "_dataStore",
        type: "address",
      },
      {
        internalType: "contract EventEmitter",
        name: "_eventEmitter",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EmptyReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketsLength",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokensLength",
        type: "uint256",
      },
    ],
    name: "InvalidClaimFeesInput",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "msgSender",
        type: "address",
      },
      {
        internalType: "string",
        name: "role",
        type: "string",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "markets",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "claimFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dataStore",
    outputs: [
      {
        internalType: "contract DataStore",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eventEmitter",
    outputs: [
      {
        internalType: "contract EventEmitter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "roleStore",
    outputs: [
      {
        internalType: "contract RoleStore",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60e06040523480156200001157600080fd5b50604051620016f1380380620016f1833981016040819052620000349162000070565b60016000556001600160a01b0392831660805290821660a0521660c052620000c4565b6001600160a01b03811681146200006d57600080fd5b50565b6000806000606084860312156200008657600080fd5b8351620000938162000057565b6020850151909350620000a68162000057565b6040850151909250620000b98162000057565b809150509250925092565b60805160a05160c0516115e46200010d6000396000818160d501526102ac01526000818160ae015281816101a6015261028b015260008181606b015261039c01526115e46000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633de460f0146100515780634a4a7b0414610066578063660d0d67146100a95780639ff78c30146100d0575b600080fd5b61006461005f366004610aea565b6100f7565b005b61008d7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b61008d7f000000000000000000000000000000000000000000000000000000000000000081565b61008d7f000000000000000000000000000000000000000000000000000000000000000081565b6100ff610327565b61016e604051602001610130906020808252600a90820152692322a2afa5a2a2a822a960b11b604082015260600190565b604051602081830303815290604052805190602001206040518060400160405280600a8152602001692322a2afa5a2a2a822a960b11b815250610380565b80518251146101a257815181516040516384fa13d560e01b8152600481019290925260248201526044015b60405180910390fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166321f8a721604051602001610203906020808252600c908201526b2322a2afa922a1a2a4ab22a960a11b604082015260600190565b604051602081830303815290604052805190602001206040518263ffffffff1660e01b815260040161023791815260200190565b602060405180830381865afa158015610254573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102789190610b4d565b905060005b8351811015610317576103057f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000008684815181106102dd576102dd610b71565b60200260200101518685815181106102f7576102f7610b71565b602002602001015186610430565b8061030f81610b87565b91505061027d565b50506103236001600055565b5050565b6002600054036103795760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610199565b6002600055565b60405163ac4ab3fb60e01b8152336004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063ac4ab3fb90604401602060405180830381865afa1580156103eb573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061040f9190610bae565b61032357338160405163a35b150b60e01b8152600401610199929190610c16565b6104398161061c565b60006104458484610646565b60405163bd02d0f560e01b8152600481018290529091506000906001600160a01b0388169063bd02d0f590602401602060405180830381865afa158015610490573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b49190610c42565b604051637152429d60e11b815260048101849052600060248201529091506001600160a01b0388169063e2a4853a906044016020604051808303816000875af1158015610505573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105299190610c42565b5060405163078d3b7960e01b81526001600160a01b03858116600483015284811660248301526044820183905286169063078d3b7990606401600060405180830381600087803b15801561057c57600080fd5b505af1158015610590573d6000803e3d6000fd5b5050604051632c9800af60e11b81526001600160a01b03808b1660048301528816602482015273__$e53db83827f4e07ebc418caf7145b8c2d5$__9250635930015e915060440160006040518083038186803b1580156105ef57600080fd5b505af4158015610603573d6000803e3d6000fd5b50505050610613868685846106d6565b50505050505050565b6001600160a01b0381166106435760405163d551823d60e01b815260040160405180910390fd5b50565b60006040516020016106809060208082526014908201527310d31052535050931157d1915157d05353d5539560621b604082015260600190565b60408051601f198184030181528282528051602091820120908301526001600160a01b03808616918301919091528316606082015260800160405160208183030381529060405280519060200120905092915050565b6106de61091d565b80516106eb906002610808565b6040805180820190915260068152651b585c9ad95d60d21b60208201528151610717916000908761086d565b6040805180820190915260088152673932b1b2b4bb32b960c11b60208201528151610745916001908661086d565b6020810151610755906001610808565b610792600060405180604001604052806009815260200168199959505b5bdd5b9d60ba1b8152508484602001516108ca909392919063ffffffff16565b846001600160a01b03166324de01e46107b1866001600160a01b031690565b836040518363ffffffff1660e01b81526004016107cf9291906114ab565b600060405180830381600087803b1580156107e957600080fd5b505af11580156107fd573d6000803e3d6000fd5b505050505050505050565b806001600160401b0381111561082057610820610a0e565b60405190808252806020026020018201604052801561086657816020015b60408051808201909152606081526000602082015281526020019060019003908161083e5790505b5090915250565b818460000151848151811061088457610884610b71565b60200260200101516000018190525080846000015184815181106108aa576108aa610b71565b6020908102919091018101516001600160a01b0390921691015250505050565b81846000015184815181106108e1576108e1610b71565b602002602001015160000181905250808460000151848151811061090757610907610b71565b6020026020010151602001818152505050505050565b604080516101208101909152606060e082018181526101008301919091528190815260200161095f604051806040016040528060608152602001606081525090565b8152602001610981604051806040016040528060608152602001606081525090565b81526020016109a3604051806040016040528060608152602001606081525090565b81526020016109c5604051806040016040528060608152602001606081525090565b81526020016109e7604051806040016040528060608152602001606081525090565b8152602001610a09604051806040016040528060608152602001606081525090565b905290565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461064357600080fd5b8035610a4481610a24565b919050565b600082601f830112610a5a57600080fd5b813560206001600160401b0380831115610a7657610a76610a0e565b8260051b604051601f19603f83011681018181108482111715610a9b57610a9b610a0e565b604052938452858101830193838101925087851115610ab957600080fd5b83870191505b84821015610adf57610ad082610a39565b83529183019190830190610abf565b979650505050505050565b60008060408385031215610afd57600080fd5b82356001600160401b0380821115610b1457600080fd5b610b2086838701610a49565b93506020850135915080821115610b3657600080fd5b50610b4385828601610a49565b9150509250929050565b600060208284031215610b5f57600080fd5b8151610b6a81610a24565b9392505050565b634e487b7160e01b600052603260045260246000fd5b600060018201610ba757634e487b7160e01b600052601160045260246000fd5b5060010190565b600060208284031215610bc057600080fd5b81518015158114610b6a57600080fd5b6000815180845260005b81811015610bf657602081850181015186830182015201610bda565b506000602082860101526020601f19601f83011685010191505092915050565b6001600160a01b0383168152604060208201819052600090610c3a90830184610bd0565b949350505050565b600060208284031215610c5457600080fd5b5051919050565b600081518084526020808501808196508360051b810191508286016000805b86811015610cf6578385038a52825160408151818852610c9c82890182610bd0565b92890151888403898b01528051808552908a01938693508a0191505b80831015610ce15783516001600160a01b03168252928901926001929092019190890190610cb8565b509b88019b9650505091850191600101610c7a565b509298975050505050505050565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b82811015610d7b57898603605f1901845284518051888852610d5589890182610bd0565b918401516001600160a01b03169784019790975295509381019392810192600101610d31565b50808801519550888503818a015250505050610d978183610c5b565b95945050505050565b600081518084526020808501808196508360051b810191508286016000805b86811015610cf6578385038a52825160408151818852610de182890182610bd0565b92890151888403898b01528051808552908a01938693508a0191505b80831015610e1d5783518252928901926001929092019190890190610dfd565b509b88019b9650505091850191600101610dbf565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b82811015610ea057898603605f1901845284518051888852610e8389890182610bd0565b918401519784019790975295509381019392810192600101610e5f565b50808801519550888503818a015250505050610d978183610da0565b600081518084526020808501808196508360051b810191508286016000805b86811015610cf6578385038a52825160408151818852610efd82890182610bd0565b92890151888403898b01528051808552908a01938693508a0191505b80831015610f395783518252928901926001929092019190890190610f19565b509b88019b9650505091850191600101610edb565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b82811015610fbc57898603605f1901845284518051888852610f9f89890182610bd0565b918401519784019790975295509381019392810192600101610f7b565b50808801519550888503818a015250505050610d978183610ebc565b600081518084526020808501808196508360051b810191508286016000805b86811015610cf6578385038a5282516040815181885261101982890182610bd0565b92890151888403898b01528051808552908a01938693508a0191505b8083101561105757835115158252928901926001929092019190890190611035565b509b88019b9650505091850191600101610ff7565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b828110156110dc57898603605f19018452845180518888526110bd89890182610bd0565b9184015115159784019790975295509381019392810192600101611099565b50808801519550888503818a015250505050610d978183610fd8565b600081518084526020808501808196508360051b810191508286016000805b86811015610cf6578385038a5282516040815181885261113982890182610bd0565b92890151888403898b01528051808552908a01938693508a0191505b808310156111755783518252928901926001929092019190890190611155565b509b88019b9650505091850191600101611117565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b828110156111f857898603605f19018452845180518888526111db89890182610bd0565b9184015197840197909752955093810193928101926001016111b7565b50808801519550888503818a015250505050610d9781836110f8565b600081518084526020808501808196506005915083821b81018387016000805b878110156112bf578484038b5282516040815181875261125682880182610bd0565b928a0151878403888c01528051808552908b019392508a83019150808a1b83018b01865b828110156112a857601f19858303018452611296828751610bd0565b958d0195938d0193915060010161127a565b509e8b019e97505050938801935050600101611234565b50919998505050505050505050565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b8281101561134b57898603605f190184528451805188885261131f89890182610bd0565b91840151888303898601529190506113378183610bd0565b9750505093810193928101926001016112fb565b50808801519550888503818a015250505050610d978183611214565b600081518084526020808501808196506005915083821b81018387016000805b878110156112bf578484038b528251604081518187526113a982880182610bd0565b928a0151878403888c01528051808552908b019392508a83019150808a1b83018b01865b828110156113fb57601f198583030184526113e9828751610bd0565b958d0195938d019391506001016113cd565b509e8b019e97505050938801935050600101611387565b60006040808401835182865281815180845260608801915060608160051b89010193506020808401935060005b8281101561148f57898603605f190184528451805188885261146389890182610bd0565b918401518883038986015291905061147b8183610bd0565b97505050938101939281019260010161143f565b50808801519550888503818a015250505050610d978183611367565b60608152600b60608201526a1199595cd0db185a5b595960aa1b608082015282602082015260a060408201526000825160e060a08401526114f0610180840182610d04565b90506020840151609f19808584030160c086015261150e8383610e32565b925060408601519150808584030160e086015261152b8383610f4e565b9250606086015191508085840301610100860152611549838361106c565b9250608086015191508085840301610120860152611567838361118a565b925060a08601519150808584030161014086015261158583836112ce565b925060c086015191508085840301610160860152506115a48282611412565b969550505050505056fea2646970667358221220d601675e8c792cfdf526b73b8b7c706c68e3b3c9b26dd6f6ab63f7d4fdc9c5bb64736f6c63430008120033";

type FeeHandlerConstructorParams =
  | [linkLibraryAddresses: FeeHandlerLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FeeHandlerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class FeeHandler__factory extends ContractFactory {
  constructor(...args: FeeHandlerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(
        _abi,
        FeeHandler__factory.linkBytecode(linkLibraryAddresses),
        signer
      );
    }
  }

  static linkBytecode(
    linkLibraryAddresses: FeeHandlerLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$e53db83827f4e07ebc418caf7145b8c2d5\\$__", "g"),
      linkLibraryAddresses["contracts/market/MarketUtils.sol:MarketUtils"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  override deploy(
    _roleStore: PromiseOrValue<string>,
    _dataStore: PromiseOrValue<string>,
    _eventEmitter: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FeeHandler> {
    return super.deploy(
      _roleStore,
      _dataStore,
      _eventEmitter,
      overrides || {}
    ) as Promise<FeeHandler>;
  }
  override getDeployTransaction(
    _roleStore: PromiseOrValue<string>,
    _dataStore: PromiseOrValue<string>,
    _eventEmitter: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _roleStore,
      _dataStore,
      _eventEmitter,
      overrides || {}
    );
  }
  override attach(address: string): FeeHandler {
    return super.attach(address) as FeeHandler;
  }
  override connect(signer: Signer): FeeHandler__factory {
    return super.connect(signer) as FeeHandler__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FeeHandlerInterface {
    return new utils.Interface(_abi) as FeeHandlerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FeeHandler {
    return new Contract(address, _abi, signerOrProvider) as FeeHandler;
  }
}

export interface FeeHandlerLibraryAddresses {
  ["contracts/market/MarketUtils.sol:MarketUtils"]: string;
}