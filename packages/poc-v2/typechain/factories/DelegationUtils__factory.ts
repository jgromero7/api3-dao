/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { DelegationUtils } from "../DelegationUtils";

export class DelegationUtils__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    api3TokenAddress: string,
    overrides?: Overrides
  ): Promise<DelegationUtils> {
    return super.deploy(
      api3TokenAddress,
      overrides || {}
    ) as Promise<DelegationUtils>;
  }
  getDeployTransaction(
    api3TokenAddress: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(api3TokenAddress, overrides || {});
  }
  attach(address: string): DelegationUtils {
    return super.attach(address) as DelegationUtils;
  }
  connect(signer: Signer): DelegationUtils__factory {
    return super.connect(signer) as DelegationUtils__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DelegationUtils {
    return new Contract(address, _abi, signerOrProvider) as DelegationUtils;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "api3TokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
    ],
    name: "Delegated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newApr",
        type: "uint256",
      },
    ],
    name: "Epoch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
    ],
    name: "Undelegated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toEpoch",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "locked",
        type: "uint256",
      },
    ],
    name: "UserUpdate",
    type: "event",
  },
  {
    inputs: [],
    name: "currentApr",
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
        name: "delegate",
        type: "address",
      },
    ],
    name: "delegateShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "genesisEpoch",
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
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUserLocked",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "targetEpoch",
        type: "uint256",
      },
    ],
    name: "getUserLockedAt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastEpochPaid",
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
    name: "maxApr",
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
    name: "minApr",
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
        internalType: "uint256",
        name: "targetEpoch",
        type: "uint256",
      },
    ],
    name: "payReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardEpochLength",
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
    name: "rewardVestingPeriod",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rewards",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "atBlock",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeTarget",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "totalShares",
    outputs: [
      {
        internalType: "uint256",
        name: "fromBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "totalStaked",
    outputs: [
      {
        internalType: "uint256",
        name: "fromBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "undelegateShares",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unstakeWaitPeriod",
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
    name: "updateCoeff",
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
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "targetEpoch",
        type: "uint256",
      },
    ],
    name: "updateUserLocked",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "userDelegating",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_block",
        type: "uint256",
      },
    ],
    name: "userDelegatingAt",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "uint256",
        name: "unstaked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "locked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vesting",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "delegating",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "unstakeScheduledFor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "unstakeAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdateEpoch",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "oldestLockedEpoch",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a0604052622625a060065563047868c06007556a084595161401484a000000600855620f424060095562093a80600a55600654600b553480156200004357600080fd5b506040516200249d3803806200249d833981810160405260208110156200006957600080fd5b810190808051906020019092919050505080600260405180604001604052804381526020016001815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101555050600360405180604001604052804381526020016001815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101555050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506200018662093a8042620001b860201b620017b71790919060201c565b60808181525050620001aa62093a8042620001b860201b620017b71790919060201c565b6005819055505050620002d5565b60006200020283836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506200020a60201b60201c565b905092915050565b60008083118290620002ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156200027e57808201518184015260208101905062000261565b50505050905090810190601f168015620002ac5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581620002c757fe5b049050809150509392505050565b60805161219e620002ff60003980611376528061168c52806118235280611859525061219e6000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c8063784b3c5d116100b8578063b70e6be61161007c578063b70e6be6146104be578063decac4f5146104dc578063e14b5fac146104fa578063e7460a5214610552578063f301af4214610570578063f32ca51f146105b957610142565b8063784b3c5d14610375578063917656b91461039357806392093b36146103b1578063a30d8424146103cf578063a87430ba1461043357610142565b80634861f1691161010a5780634861f169146102635780634eb05c471461026d5780634f322ae81461028b57806350aa9f7b146102a957806368e86df7146103035780637702059e1461034757610142565b8063106644131461014757806313f2dad01461016557806318dbf733146101ae57806320a0a0e9146101fc57806341cb8c201461021a575b600080fd5b61014f61061b565b6040518082815260200191505060405180910390f35b6101916004803603602081101561017b57600080fd5b8101908080359060200190929190505050610621565b604051808381526020018281526020019250505060405180910390f35b6101fa600480360360408110156101c457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610652565b005b610204610725565b6040518082815260200191505060405180910390f35b6102466004803603602081101561023057600080fd5b810190808035906020019092919050505061072c565b604051808381526020018281526020019250505060405180910390f35b61026b61075d565b005b610275610a27565b6040518082815260200191505060405180910390f35b610293610a2d565b6040518082815260200191505060405180910390f35b6102eb600480360360208110156102bf57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a33565b60405180821515815260200191505060405180910390f35b6103456004803603602081101561031957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a46565b005b6103736004803603602081101561035d57600080fd5b8101908080359060200190929190505050610ed2565b005b61037d611283565b6040518082815260200191505060405180910390f35b61039b611289565b6040518082815260200191505060405180910390f35b6103b961128f565b6040518082815260200191505060405180910390f35b61041b600480360360408110156103e557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611295565b60405180821515815260200191505060405180910390f35b6104756004803603602081101561044957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061131f565b6040518089815260200188815260200187815260200186151581526020018581526020018481526020018381526020018281526020019850505050505050505060405180910390f35b6104c6611374565b6040518082815260200191505060405180910390f35b6104e4611398565b6040518082815260200191505060405180910390f35b61053c6004803603602081101561051057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061139d565b6040518082815260200191505060405180910390f35b61055a6113c5565b6040518082815260200191505060405180910390f35b61059c6004803603602081101561058657600080fd5b81019080803590602001909291905050506113cb565b604051808381526020018281526020019250505060405180910390f35b610605600480360360408110156105cf57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506113ef565b6040518082815260200191505060405180910390f35b60095481565b6002818154811061062e57fe5b90600052602060002090600202016000915090508060000154908060010154905082565b600061065e83836113ef565b90506000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508181600201819055506106b4611801565b81600b01819055508281600a01819055508373ffffffffffffffffffffffffffffffffffffffff167f6aa46aa24dd78d66eaff80fdc122ff406f1b5afe46204d8008b60282c8ec79af848360020154604051808381526020018281526020019250505060405180910390a250505050565b62093a8081565b6003818154811061073957fe5b90600052602060002090600202016000915090508060000154908060010154905082565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060006107ae82600501611898565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610853576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f4e6f742063757272656e746c792064656c65676174696e67000000000000000081525060200191505060405180910390fd5b6000610861836001016118ab565b90506000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060060160405180604001604052804381526020016108d9856108cb866006016118ab565b6118be90919063ffffffff16565b815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101555050836005016040518060400160405280438152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f1af5b1c85495b3618ea659a1ba256c8b8974b437297d3b914e321e086a28da7260405160405180910390a350505050565b60085481565b600b5481565b6000610a3f8243611295565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614158015610aaf57503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b610b21576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f496e76616c69642074617267657400000000000000000000000000000000000081525060200191505060405180910390fd5b610b2a81610a33565b15610b80576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260358152602001806121136035913960400191505060405180910390fd5b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000610bd1826001016118ab565b90506000610be183600501611898565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610d0d578373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610c5357505050610ecf565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050806006016040518060400160405280438152602001610cc986610cbb866006016118ab565b6118be90919063ffffffff16565b815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101555050505b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050806006016040518060400160405280438152602001610d8386610d75866006016118ab565b61190890919063ffffffff16565b8152509080600181540180825580915050600190039060005260206000209060020201600090919091909150600082015181600001556020820151816001015550508360050160405180604001604052804381526020018773ffffffffffffffffffffffffffffffffffffffff1681525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050508473ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f4bc154dd35d6a5cb9206482ecb473cdbf2473006d6bce728b9cc0741bcc59ea260405160405180910390a3505050505b50565b806005541015611280576000610ef4600160055461190890919063ffffffff16565b90506000610f0260036118ab565b905060005b8383116112185760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663bbb30c5d306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610f9557600080fd5b505afa158015610fa9573d6000803e3d6000fd5b505050506040513d6020811015610fbf57600080fd5b8101908080519060200190929190505050611063576040518060400160405280600081526020014381525060046000858152602001908152602001600020600082015181600001556020820151816001015590505083600581905550827fce8f0c0868b3497f8bb005e8ee9d6f967e32053f5290e2c1c3390e106b92cde46000600b54604051808381526020018281526020019250505060405180910390a2611213565b61106c82611990565b60006110ac6305f5e10061109e6034611090600b5488611b2f90919063ffffffff16565b6117b790919063ffffffff16565b6117b790919063ffffffff16565b905060405180604001604052808281526020014381525060046000868152602001908152602001600020600082015181600001556020820151816001015590505060008111156111b95760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340c10f1930836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561118757600080fd5b505af115801561119b573d6000803e3d6000fd5b505050506111b2818461190890919063ffffffff16565b9250600191505b837fce8f0c0868b3497f8bb005e8ee9d6f967e32053f5290e2c1c3390e106b92cde482600b54604051808381526020018281526020019250505060405180910390a261120f60018561190890919063ffffffff16565b9350505b610f07565b82600581905550801561127c5760036040518060400160405280438152602001848152509080600181540180825580915050600190039060005260206000209060020201600090919091909150600082015181600001556020820151816001015550505b5050505b50565b60065481565b60055481565b60075481565b6000806112e3600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060050184611bb5565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141591505092915050565b60016020528060005260406000206000915090508060000154908060020154908060030154908060040160009054906101000a900460ff169080600701549080600801549080600a01549080600b0154905088565b7f000000000000000000000000000000000000000000000000000000000000000081565b603481565b60006113be826113b962093a80426117b790919063ffffffff16565b6113ef565b9050919050565b600a5481565b60046020528060005260406000206000915090508060000154908060010154905082565b6000806113fa611d87565b905061140581610ed2565b600061141d62093a80426117b790919063ffffffff16565b90506000611429611801565b90506000600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050600081600a0154905083871115801561148657508087115b801561149157508287115b611503576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f496e76616c69642074617267657400000000000000000000000000000000000081525060200191505060405180910390fd5b828110156115c1576000808490505b8881116115b3576000600460008381526020019081526020016000209050600061154160028360010154611dfa565b90506000611556876001018460010154611dfa565b905061159361158483611576848760000154611b2f90919063ffffffff16565b6117b790919063ffffffff16565b8661190890919063ffffffff16565b94505050506115ac60018261190890919063ffffffff16565b9050611512565b5080965050505050506117b0565b60008260020154905060006115e060018461190890919063ffffffff16565b90505b888111611684576000600460008381526020019081526020016000209050600061161260028360010154611dfa565b90506000611627876001018460010154611dfa565b905061166461165583611647848760000154611b2f90919063ffffffff16565b6117b790919063ffffffff16565b8661190890919063ffffffff16565b945050505061167d60018261190890919063ffffffff16565b90506115e3565b506116b960347f000000000000000000000000000000000000000000000000000000000000000061190890919063ffffffff16565b88106117a757600083600b015490505b6116dd6001866118be90919063ffffffff16565b81116117a5576000600460006116fd6034856118be90919063ffffffff16565b81526020019081526020016000209050600061171e60028360010154611dfa565b90506000611733876001018460010154611dfa565b9050600061176083611752848760000154611b2f90919063ffffffff16565b6117b790919063ffffffff16565b9050808611611770576000611784565b61178381876118be90919063ffffffff16565b5b95505050505061179e60018261190890919063ffffffff16565b90506116c9565b505b80965050505050505b5092915050565b60006117f983836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250611f8c565b905092915050565b60008061181a62093a80426117b790919063ffffffff16565b905061185060347f000000000000000000000000000000000000000000000000000000000000000061190890919063ffffffff16565b81101561187d577f0000000000000000000000000000000000000000000000000000000000000000611892565b6118916034826118be90919063ffffffff16565b5b91505090565b60006118a48243611bb5565b9050919050565b60006118b78243611dfa565b9050919050565b600061190083836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250612052565b905092915050565b600080828401905083811015611986576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b600060085414156119a957600654600b81905550611b2c565b600060085482106119ce576119c9600854836118be90919063ffffffff16565b6119e4565b6119e3826008546118be90919063ffffffff16565b5b90506000611a13600854611a056305f5e10085611b2f90919063ffffffff16565b6117b790919063ffffffff16565b90506000611a41620f4240611a3360095485611b2f90919063ffffffff16565b6117b790919063ffffffff16565b90506000600854851015611a9757611a906305f5e100611a82611a71856305f5e10061190890919063ffffffff16565b600b54611b2f90919063ffffffff16565b6117b790919063ffffffff16565b9050611aee565b816305f5e10011611aa9576000611aeb565b611aea6305f5e100611adc611acb856305f5e1006118be90919063ffffffff16565b600b54611b2f90919063ffffffff16565b6117b790919063ffffffff16565b5b90505b600654811015611b0657600654600b81905550611b27565b600754811115611b1e57600754600b81905550611b26565b80600b819055505b5b505050505b50565b600080831415611b425760009050611baf565b6000828402905082848281611b5357fe5b0414611baa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806121486021913960400191505060405180910390fd5b809150505b92915050565b60008083805490501415611bcc5760009050611d81565b82611be5600185805490506118be90919063ffffffff16565b81548110611bef57fe5b9060005260206000209060020201600001548210611c635782611c20600185805490506118be90919063ffffffff16565b81548110611c2a57fe5b906000526020600020906002020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611d81565b82600081548110611c7057fe5b906000526020600020906002020160000154821015611c925760009050611d81565b600080611cad600186805490506118be90919063ffffffff16565b90505b81811115611d3e576000611cf36002611ce56001611cd7878761190890919063ffffffff16565b61190890919063ffffffff16565b6117b790919063ffffffff16565b905084868281548110611d0257fe5b90600052602060002090600202016000015411611d2157809250611d38565b611d356001826118be90919063ffffffff16565b91505b50611cb0565b848281548110611d4a57fe5b906000526020600020906002020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16925050505b92915050565b600080611da062093a80426117b790919063ffffffff16565b90506000611db9600554836118be90919063ffffffff16565b90506005811115611df157611dec611ddb6002836117b790919063ffffffff16565b60055461190890919063ffffffff16565b611df3565b815b9250505090565b60008083805490501415611e115760009050611f86565b82611e2a600185805490506118be90919063ffffffff16565b81548110611e3457fe5b9060005260206000209060020201600001548210611e885782611e65600185805490506118be90919063ffffffff16565b81548110611e6f57fe5b9060005260206000209060020201600101549050611f86565b82600081548110611e9557fe5b906000526020600020906002020160000154821015611eb75760009050611f86565b600080611ed2600186805490506118be90919063ffffffff16565b90505b81811115611f63576000611f186002611f0a6001611efc878761190890919063ffffffff16565b61190890919063ffffffff16565b6117b790919063ffffffff16565b905084868281548110611f2757fe5b90600052602060002090600202016000015411611f4657809250611f5d565b611f5a6001826118be90919063ffffffff16565b91505b50611ed5565b848281548110611f6f57fe5b906000526020600020906002020160010154925050505b92915050565b60008083118290612038576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611ffd578082015181840152602081019050611fe2565b50505050905090810190601f16801561202a5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50600083858161204457fe5b049050809150509392505050565b60008383111582906120ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156120c45780820151818401526020810190506120a9565b50505050905090810190601f1680156120f15780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838503905080915050939250505056fe43616e6e6f742064656c656761746520746f206120757365722077686f2069732063757272656e746c792064656c65676174696e67536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a2646970667358221220cd09c6552476aeb6d2847189880d976fc6e96961e33c038638a5587ccb42588964736f6c634300060c0033";