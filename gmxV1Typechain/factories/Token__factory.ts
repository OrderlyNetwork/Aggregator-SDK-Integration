/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Token, TokenInterface } from "../Token";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604080518082019091526005808252642a37b5b2b760d91b602090920191825261003d9160039161007d565b50604080518082019091526005808252642a27a5a2a760d91b602090920191825261006a9160049161007d565b506005805460ff19166012179055610110565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100be57805160ff19168380011785556100eb565b828001600101855582156100eb579182015b828111156100eb5782518255916020019190600101906100d0565b506100f79291506100fb565b5090565b5b808211156100f757600081556001016100fc565b610ed48061011f6000396000f3fe6080604052600436106100b85760003560e01c806301e33667146100bd57806306fdde0314610102578063095ea7b31461018c57806318160ddd146101d957806323b872dd146102005780632e1a7d4d14610243578063313ce5671461026d578063395093511461029857806340c10f19146102d157806370a082311461030a57806395d89b411461033d578063a457c2d714610352578063a9059cbb1461038b578063d0e30db0146103c4578063dd62ed3e146103cc575b600080fd5b3480156100c957600080fd5b50610100600480360360608110156100e057600080fd5b506001600160a01b03813581169160208101359091169060400135610407565b005b34801561010e57600080fd5b5061011761048f565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610151578181015183820152602001610139565b50505050905090810190601f16801561017e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561019857600080fd5b506101c5600480360360408110156101af57600080fd5b506001600160a01b038135169060200135610525565b604080519115158252519081900360200190f35b3480156101e557600080fd5b506101ee610542565b60408051918252519081900360200190f35b34801561020c57600080fd5b506101c56004803603606081101561022357600080fd5b506001600160a01b03813581169160208101359091169060400135610548565b34801561024f57600080fd5b506101006004803603602081101561026657600080fd5b50356105cf565b34801561027957600080fd5b5061028261066c565b6040805160ff9092168252519081900360200190f35b3480156102a457600080fd5b506101c5600480360360408110156102bb57600080fd5b506001600160a01b038135169060200135610675565b3480156102dd57600080fd5b50610100600480360360408110156102f457600080fd5b506001600160a01b0381351690602001356106c3565b34801561031657600080fd5b506101ee6004803603602081101561032d57600080fd5b50356001600160a01b03166106cd565b34801561034957600080fd5b506101176106e8565b34801561035e57600080fd5b506101c56004803603604081101561037557600080fd5b506001600160a01b038135169060200135610749565b34801561039757600080fd5b506101c5600480360360408110156103ae57600080fd5b506001600160a01b0381351690602001356107b1565b6101006107c5565b3480156103d857600080fd5b506101ee600480360360408110156103ef57600080fd5b506001600160a01b03813581169160200135166107d1565b826001600160a01b031663a9059cbb83836040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561045e57600080fd5b505af1158015610472573d6000803e3d6000fd5b505050506040513d602081101561048857600080fd5b5050505050565b60038054604080516020601f600260001961010060018816150201909516949094049384018190048102820181019092528281526060939092909183018282801561051b5780601f106104f05761010080835404028352916020019161051b565b820191906000526020600020905b8154815290600101906020018083116104fe57829003601f168201915b5050505050905090565b60006105396105326107fc565b8484610800565b50600192915050565b60025490565b60006105558484846108ec565b6105c5846105616107fc565b6105c085604051806060016040528060288152602001610dc8602891396001600160a01b038a1660009081526001602052604081209061059f6107fc565b6001600160a01b031681526020810191909152604001600020549190610a35565b610800565b5060019392505050565b33600090815260208190526040902054811115610631576040805162461bcd60e51b815260206004820152601b60248201527a546f6b656e3a20696e73756666696369656e742062616c616e636560281b604482015290519081900360640190fd5b61063b3382610acc565b604051339082156108fc029083906000818181858888f19350505050158015610668573d6000803e3d6000fd5b5050565b60055460ff1690565b60006105396106826107fc565b846105c085600160006106936107fc565b6001600160a01b03908116825260208083019390935260409182016000908120918c168152925290205490610bb6565b6106688282610c15565b6001600160a01b031660009081526020819052604090205490565b60048054604080516020601f600260001961010060018816150201909516949094049384018190048102820181019092528281526060939092909183018282801561051b5780601f106104f05761010080835404028352916020019161051b565b60006105396107566107fc565b846105c085604051806060016040528060258152602001610e7a60259139600160006107806107fc565b6001600160a01b03908116825260208083019390935260409182016000908120918d16815292529020549190610a35565b60006105396107be6107fc565b84846108ec565b6107cf3334610c15565b565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b3390565b6001600160a01b0383166108455760405162461bcd60e51b8152600401808060200182810382526024815260200180610e566024913960400191505060405180910390fd5b6001600160a01b03821661088a5760405162461bcd60e51b8152600401808060200182810382526022815260200180610d806022913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166109315760405162461bcd60e51b8152600401808060200182810382526025815260200180610e316025913960400191505060405180910390fd5b6001600160a01b0382166109765760405162461bcd60e51b8152600401808060200182810382526023815260200180610d3b6023913960400191505060405180910390fd5b610981838383610cf3565b6109be81604051806060016040528060268152602001610da2602691396001600160a01b0386166000908152602081905260409020549190610a35565b6001600160a01b0380851660009081526020819052604080822093909355908416815220546109ed9082610bb6565b6001600160a01b03808416600081815260208181526040918290209490945580518581529051919392871692600080516020610df083398151915292918290030190a3505050565b60008184841115610ac45760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610a89578181015183820152602001610a71565b50505050905090810190601f168015610ab65780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6001600160a01b038216610b115760405162461bcd60e51b8152600401808060200182810382526021815260200180610e106021913960400191505060405180910390fd5b610b1d82600083610cf3565b610b5a81604051806060016040528060228152602001610d5e602291396001600160a01b0385166000908152602081905260409020549190610a35565b6001600160a01b038316600090815260208190526040902055600254610b809082610cf8565b6002556040805182815290516000916001600160a01b03851691600080516020610df08339815191529181900360200190a35050565b600082820183811015610c0e576040805162461bcd60e51b815260206004820152601b60248201527a536166654d6174683a206164646974696f6e206f766572666c6f7760281b604482015290519081900360640190fd5b9392505050565b6001600160a01b038216610c70576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b610c7c60008383610cf3565b600254610c899082610bb6565b6002556001600160a01b038216600090815260208190526040902054610caf9082610bb6565b6001600160a01b038316600081815260208181526040808320949094558351858152935192939192600080516020610df08339815191529281900390910190a35050565b505050565b6000610c0e83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610a3556fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a206275726e20616d6f756e7420657863656564732062616c616e636545524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e6365ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef45524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220b5fdf2414753dcda2ecdf8f62af4e89f8901d168d7b5c9a1de4af31c6b865abe64736f6c634300060c0033";

export class Token__factory extends ContractFactory {
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
  ): Promise<Token> {
    return super.deploy(overrides || {}) as Promise<Token>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Token {
    return super.attach(address) as Token;
  }
  connect(signer: Signer): Token__factory {
    return super.connect(signer) as Token__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenInterface {
    return new utils.Interface(_abi) as TokenInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Token {
    return new Contract(address, _abi, signerOrProvider) as Token;
  }
}
