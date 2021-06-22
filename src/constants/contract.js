import { contractAddresses, pairs } from "./constants";

// abi
import ERC20Abi from "./abi/ERC20.json";
import UNIV2PairAbi from "./abi/UniswapV2Pair.json";
import WETHAbi from "./abi/WETH.json";
import MasterAbi from "./abi/Ad3StakeManager.json";
import ERC721Abi from "./abi/ERC721-ABI.json";

export default class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType = options.confirmationType;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    this.weth = new this.web3.eth.Contract(WETHAbi);
    this.master = new this.web3.eth.Contract(MasterAbi);

    this.pools = pairs.map((pool) =>
      Object.assign(pool, {
        lpAddress: pool.lpAddresses[networkId],
        tokenAddress: pool.tokenAddresses[networkId],
        lpContract: new this.web3.eth.Contract(ERC721Abi),
        tokenContract: new this.web3.eth.Contract(ERC721Abi),
      })
    );

    this.setProvider(provider, networkId);
    this.setDefaultAccount(this.web3.eth.defaultAccount);
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider);

      if (address) {
        contract.options.address = address;
      } else {
        console.error("Contract address not found in network", networkId);
      }
    };

    setProvider(this.weth, contractAddresses.weth[networkId]);
    setProvider(this.master, contractAddresses.master[networkId]);

    this.pools.forEach(
      ({ lpContract, lpAddress, tokenContract, tokenAddress }) => {
        setProvider(lpContract, lpAddress, true);
        setProvider(tokenContract, tokenAddress, true);
      }
    );
  }

  setDefaultAccount(account) {}
}
