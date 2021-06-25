import config from "../config";
import async from "async";
import * as moment from "moment";
import {
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_LIQUIDITY_BALANCES,
  GET_LIQUIDITY_BALANCES_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  PROPOSE,
  PROPOSE_RETURNED,
  GET_PROPOSALS,
  GET_PROPOSALS_RETURNED,
  VOTE_FOR,
  VOTE_FOR_RETURNED,
  VOTE_AGAINST,
  VOTE_AGAINST_RETURNED,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  CLAIM,
  CLAIM_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_RETURNED,
  GET_YCRV_REQUIREMENTS,
  GET_YCRV_REQUIREMENTS_RETURNED,
  GET_GOVERNANCE_REQUIREMENTS,
  GET_GOVERNANCE_REQUIREMENTS_RETURNED,
  REGISTER_VOTE,
  REGISTER_VOTE_RETURNED,
  GET_VOTE_STATUS,
  GET_VOTE_STATUS_RETURNED,
  GETROI,
  GETDAIROI,
  GETKANIROI,
  GETUNIKANIROI,
} from "../constants";
import Web3 from "web3";

import {
  injected,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  frame,
  fortmatic,
  portis,
  squarelink,
  torus,
  authereum,
} from "./connectors";

const rp = require("request-promise");
const ethers = require("ethers");

const Dispatcher = require("flux").Dispatcher;
const Emitter = require("events").EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {
    this.store = {
      votingStatus: false,
      governanceContractVersion: 2,
      currentBlock: 0,
      universalGasPrice: "70",
      account: {},
      web3: null,
      connectorsByName: {
        MetaMask: injected,
        TrustWallet: injected,
        WalletConnect: walletconnect,
        WalletLink: walletlink,
        Ledger: ledger,
        Trezor: trezor,
        Frame: frame,
        Fortmatic: fortmatic,
        Portis: portis,
        Squarelink: squarelink,
        Torus: torus,
        Authereum: authereum,
      },
      web3context: null,
      languages: [
        {
          language: "English",
          code: "en",
        },
        {
          language: "Japanese",
          code: "ja",
        },
        {
          language: "Chinese",
          code: "zh",
        },
      ],
      proposals: [],
      claimableAsset: {
        id: "yfi",
        name: "yearn.finance",
        address: config.yfiAddress,
        abi: config.yfiABI,
        symbol: "YFI",
        balance: 0,
        decimals: 18,
        rewardAddress: "0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d",
        rewardSymbol: "aDAI",
        rewardDecimals: 18,
        claimableBalance: 0,
      },
      liquidityPools: [
        {
          id: "BalanceKani",
          name: "BalanceKani",
          pairSymbol: "WETH",
          wethKaniRoi: "",
          linkLiqui:
            "https://pools.balancer.exchange/#/pool/0x8B2E66C3B277b2086a976d053f1762119A92D280/",
          linkTrade:
            "https://legacy.balancer.exchange/#/swap/0x790aCe920bAF3af2b773D4556A69490e077F6B4A",
          depositsEnabled: true,
          tokens: [
            {
              id: "bpt",
              address: "0x8B2E66C3B277b2086a976d053f1762119A92D280",
              symbol: "BPT",
              abi: config.bpoolABI,
              decimals: 18,
              rewardsAddress: config.balanceKaniAddress,
              rewardsABI: config.balanceKaniABI,
              rewardsSymbol: "AD3",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "UniswapKani",
          name: "UniswapKani",
          pairSymbol: "USDT",
          usdtKaniRoi: "",
          linkLiqui:
            "https://app.uniswap.org/#/add/0xdAC17F958D2ee523a2206206994597C13D831ec7/0x790aCe920bAF3af2b773D4556A69490e077F6B4A",
          linkTrade:
            "https://app.uniswap.org/#/swap?inputCurrency=0xdac17f958d2ee523a2206206994597c13d831ec7&outputCurrency=0x790aCe920bAF3af2b773D4556A69490e077F6B4A",
          depositsEnabled: true,
          tokens: [
            {
              id: "uni",
              address: "0x65B0E3b1f36e5205e7f35781fF89f94f6A7f6C4E",
              symbol: "UNI",
              abi: config.uniswapABI,
              decimals: 18,
              rewardsAddress: config.uniswapKaniAddress,
              rewardsABI: config.uniswapKaniABI,
              rewardsSymbol: "AD3",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
      ],
      rewardPools: [
        {
          id: "yearn",
          name: "yearn",
          website: "curve.fi/y",
          link: "https://curve.fi/y",
          depositsEnabled: false,
          tokens: [
            {
              id: "ycurvefi",
              address: "0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",
              symbol: "curve.fi",
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.yCurveFiRewardsAddress,
              rewardsABI: config.yCurveFiRewardsABI,
              rewardsSymbol: "YFI",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
            // {
            //   id: 'ycurvefi',
            //   address: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
            //   symbol: 'curve.fi',
            //   abi: config.erc20ABI,
            //   decimals: 18,
            //   rewardsAddress: config.yCurveFiRewardsAddress,
            //   rewardsABI: config.yCurveFiRewardsABI,
            //   rewardsSymbol: 'YFI',
            //   balance: 0,
            //   stakedBalance: 0,
            //   rewardsAvailable: 0
            // }
          ],
        },
        {
          id: "Balancer",
          name: "Balancer",
          website: "pools.balancer.exchange",
          link: "https://pools.balancer.exchange/#/pool/0x60626db611a9957C1ae4Ac5b7eDE69e24A3B76c5",
          depositsEnabled: false,
          tokens: [
            {
              id: "bpt",
              address: "0x60626db611a9957C1ae4Ac5b7eDE69e24A3B76c5",
              symbol: "BPT",
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.balancerRewardsAddress,
              rewardsABI: config.balancerRewardsABI,
              rewardsSymbol: "YFI",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "Governance",
          name: "Governance",
          website: "pools.balancer.exchange",
          link: "https://pools.balancer.exchange/#/pool/0x95c4b6c7cff608c0ca048df8b81a484aa377172b",
          depositsEnabled: false,
          tokens: [
            {
              id: "bpt",
              address: "0x95c4b6c7cff608c0ca048df8b81a484aa377172b",
              symbol: "BPT",
              abi: config.bpoolABI,
              decimals: 18,
              rewardsAddress: config.governanceAddress,
              rewardsABI: config.governanceABI,
              rewardsSymbol: "YFI",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "FeeRewards",
          name: "Fee Rewards",
          website: "ygov.finance",
          link: "https://ygov.finance/",
          depositsEnabled: false,
          tokens: [
            {
              id: "yfi",
              address: config.yfiAddress,
              symbol: "YFI",
              abi: config.yfiABI,
              decimals: 18,
              rewardsAddress: config.feeRewardsAddress,
              rewardsABI: config.feeRewardsABI,
              rewardsSymbol: "$",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "GovernanceV2 defi",
          name: "Governance V2 defi",
          website: "ygov.finance",
          link: "https://ygov.finance/",
          depositsEnabled: true,
          tokens: [
            {
              id: "eth",
              address: config.governanceV2Address,
              symbol: "ETH",
              abi: config.governanceV2ABI,
              decimals: 18,
              rewardsAddress: config.governanceV2Address,
              rewardsABI: config.governanceV2ABI,
              rewardsSymbol: "",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "GovernanceV2USDT",
          name: "GovernanceV2USDT",
          website: "ygov.finance",
          link: "https://ygov.finance/",
          depositsEnabled: true,
          tokens: [
            {
              id: "USDT",
              address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              symbol: "USDT",
              abi: config.approveUSDTABI,
              decimals: 6,
              rewardsAddress: config.governanceV2USDTAddress,
              rewardsABI: config.governanceV2USDTABI,
              rewardsSymbol: "AD3",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "GovernanceV2Dai",
          name: "GovernanceV2Dai",
          website: "ygov.finance",
          link: "https://ygov.finance/",
          depositsEnabled: true,
          tokens: [
            {
              id: "DAI",
              address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
              symbol: "DAI",
              abi: config.approveDAIABI,
              decimals: 18,
              rewardsAddress: config.governanceV2DAIAddress,
              rewardsABI: config.governanceV2DAIABI,
              rewardsSymbol: "AD3",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "GovernanceV2Kani",
          name: "GovernanceV2Kani",
          website: "ygov.finance",
          link: "https://ygov.finance/",
          depositsEnabled: true,
          tokens: [
            {
              id: "kani",
              address: "0x790aCe920bAF3af2b773D4556A69490e077F6B4A",
              symbol: "AD3",
              abi: config.kaniABI,
              decimals: 18,
              rewardsAddress: config.governanceKani,
              rewardsABI: config.governanceKaniABI,
              rewardsSymbol: "AD3",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
        {
          id: "BalanceKani",
          name: "BalanceKani",
          website: "pools.balancer.exchange",
          link: "https://pools.balancer.exchange/#/pool/0x8B2E66C3B277b2086a976d053f1762119A92D280/",
          depositsEnabled: true,
          tokens: [
            {
              id: "bpt",
              address: "0x8B2E66C3B277b2086a976d053f1762119A92D280",
              symbol: "BPT",
              abi: config.bpoolABI,
              decimals: 18,
              rewardsAddress: config.balanceKaniAddress,
              rewardsABI: config.balanceKaniABI,
              rewardsSymbol: "AD3",
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
            },
          ],
        },
      ],
    };

    // dispatcher.register(
    //     function (payload) {
    //         switch (payload.type) {
    //             case GETUNIKANIROI:
    //                 this.getPool2RoiOfUniswap(payload);
    //             case GETDAIROI:
    //                 this.getKaniRoi(payload);
    //             case GETDAIROI:
    //                 this.getStableRoi(payload);
    //             case GETROI:
    //                 this.getRoi(payload);
    //             case CONFIGURE:
    //                 this.configure(payload);
    //                 break;
    //             case GET_LIQUIDITY_BALANCES:
    //                 this.getLiquidityBalances(payload);
    //                 break;
    //             case GET_BALANCES:
    //                 this.getBalances(payload);
    //                 break;
    //             case GET_BALANCES_PERPETUAL:
    //                 this.getBalancesPerpetual(payload);
    //                 break;
    //             case STAKE:
    //                 this.stake(payload);
    //                 break;
    //             case WITHDRAW:
    //                 this.withdraw(payload);
    //                 break;
    //             case GET_REWARDS:
    //                 this.getReward(payload);
    //                 break;
    //             case EXIT:
    //                 this.exit(payload);
    //                 break;
    //             case PROPOSE:
    //                 this.propose(payload)
    //                 break;
    //             case GET_PROPOSALS:
    //                 this.getProposals(payload)
    //                 break;
    //             case REGISTER_VOTE:
    //                 this.registerVote(payload)
    //                 break;
    //             case GET_VOTE_STATUS:
    //                 this.getVoteStatus(payload)
    //                 break;
    //             case VOTE_FOR:
    //                 this.voteFor(payload)
    //                 break;
    //             case VOTE_AGAINST:
    //                 this.voteAgainst(payload)
    //                 break;
    //             case GET_CLAIMABLE_ASSET:
    //                 this.getClaimableAsset(payload)
    //                 break;
    //             case CLAIM:
    //                 this.claim(payload)
    //                 break;
    //             case GET_CLAIMABLE:
    //                 this.getClaimable(payload)
    //                 break;
    //             case GET_YCRV_REQUIREMENTS:
    //                 this.getYCRVRequirements(payload)
    //                 break;
    //             case GET_GOVERNANCE_REQUIREMENTS:
    //                 this.getGovernanceV2Requirements(payload)
    //             default: {
    //             }
    //         }
    //     }.bind(this)
    // );
  }

  getStore(index) {
    return this.store[index];
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj };
    // console.log('setStore come', this.store);
    // console.log('setStore come obj', obj)
    return emitter.emit("StoreUpdated");
  }

  configure = async () => {
    const web3 = new Web3(store.getStore("web3context").library.provider);
    const currentBlock = await web3.eth.getBlockNumber();

    store.setStore({ currentBlock: currentBlock });

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED);
    }, 100);
  };

  getBalancesPerpetual = async () => {
    const pools = store.getStore("rewardPools");
    const account = store.getStore("account");

    const web3 = new Web3(store.getStore("web3context").library.provider);

    const currentBlock = await web3.eth.getBlockNumber();
    store.setStore({ currentBlock: currentBlock });

    async.map(
      pools,
      (pool, callback) => {
        async.map(
          pool.tokens,
          (token, callbackInner) => {
            async.parallel(
              [
                (callbackInnerInner) => {
                  this._getERC20Balance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getstakedBalance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getRewardsAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
              ],
              (err, data) => {
                if (err) {
                  console.log(err);
                  return callbackInner(err);
                }
                token.balance = data[0];
                token.stakedBalance = data[1];
                token.rewardsAvailable = data[2];

                callbackInner(null, token);
              }
            );
          },
          (err, tokensData) => {
            if (err) {
              console.log(err);
              return callback(err);
            }

            pool.tokens = tokensData;
            callback(null, pool);
          }
        );
      },
      (err, poolData) => {
        if (err) {
          console.log(err);
          return emitter.emit(ERROR, err);
        }
        store.setStore({ rewardPools: poolData });
        emitter.emit(GET_BALANCES_PERPETUAL_RETURNED);
        emitter.emit(GET_BALANCES_RETURNED);
      }
    );
  };

  getBalances = async () => {
    const pools = store.getStore("rewardPools");
    const account = store.getStore("account");

    const web3 = new Web3(store.getStore("web3context").library.provider);

    async.map(
      pools,
      (pool, callback) => {
        async.map(
          pool.tokens,
          (token, callbackInner) => {
            async.parallel(
              [
                (callbackInnerInner) => {
                  this._getERC20Balance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getstakedBalance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getRewardsAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
              ],
              (err, data) => {
                if (err) {
                  return callbackInner(err);
                }

                console.log(data, "banlance get");

                token.balance = data[0];
                token.stakedBalance = data[1];
                token.rewardsAvailable = data[2];

                callbackInner(null, token);
              }
            );
          },
          (err, tokensData) => {
            if (err) {
              console.log(err);
              return callback(err);
            }
            pool.tokens = tokensData;
            callback(null, pool);
          }
        );
      },
      (err, poolData) => {
        if (err) {
          console.log(err);
          return emitter.emit(ERROR, err);
        }
        store.setStore({ rewardPools: poolData });
        emitter.emit(GET_BALANCES_RETURNED);
      }
    );
  };

  getLiquidityBalances = async () => {
    const pools = store.getStore("liquidityPools");
    const account = store.getStore("account");

    const web3 = new Web3(store.getStore("web3context").library.provider);

    async.map(
      pools,
      (pool, callback) => {
        async.map(
          pool.tokens,
          (token, callbackInner) => {
            async.parallel(
              [
                (callbackInnerInner) => {
                  this._getERC20Balance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getstakedBalance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getRewardsAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
              ],
              (err, data) => {
                if (err) {
                  return callbackInner(err);
                }

                console.log(data, "banlance get liquidity");

                token.balance = data[0];
                token.stakedBalance = data[1];
                token.rewardsAvailable = data[2];

                callbackInner(null, token);
              }
            );
          },
          (err, tokensData) => {
            if (err) {
              console.log(err);
              return callback(err);
            }
            pool.tokens = tokensData;
            callback(null, pool);
          }
        );
      },
      (err, poolData) => {
        if (err) {
          console.log(err);
          return emitter.emit(ERROR, err);
        }
        store.setStore({ liquidityPools: poolData });
        emitter.emit(GET_BALANCES_RETURNED);
      }
    );
  };

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore("web3context").library.provider);

      const erc20USDTContract = new web3.eth.Contract(asset.abi, asset.address);
      const allowance = await erc20USDTContract.methods
        .allowance(account.address, contract)
        .call({ from: account.address });

      // const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if (parseFloat(allowance) > 0) {
        // console.log('allowance big 0',allowance)
        callback();
      } else {
        const approveAmount = "10000000000";
        // console.log(approveAmount,"ssssss amount approve")
        var amountToSend = web3.utils.toWei(approveAmount, "ether");
        if (asset.decimals !== 18) {
          amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
        }
        await erc20USDTContract.methods
          .approve(contract, amountToSend)
          .send({ from: account.address });
        callback();
      }

      // var amountToSend = web3.utils.toWei(amount, "ether")
      // if (asset.decimals !== 18) {
      //     amountToSend = (amount*10**asset.decimals).toFixed(0);
      // }
      // await erc20USDTContract.methods.approve(contract,amountToSend).send({from: account.address})
      // callback()
      // if (parseFloat(ethAllowance) < parseFloat(amount)) {
      //     await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({
      //         from: account.address,
      //         gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei')
      //     })
      //     callback()
      // } else {
      //     callback()
      // }
    } catch (error) {
      console.log(error);
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };

  _checkApprovalWaitForConfirmation = async (
    asset,
    account,
    amount,
    contract,
    callback
  ) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address);
    const allowance = await erc20Contract.methods
      .allowance(account.address, contract)
      .call({ from: account.address });

    const ethAllowance = web3.utils.fromWei(allowance, "ether");

    if (parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods
        .approve(contract, web3.utils.toWei("999999999999999", "ether"))
        .send({
          from: account.address,
          gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
        })
        .on("transactionHash", function (hash) {
          callback();
        })
        .on("error", function (error) {
          if (!error.toString().includes("-32601")) {
            if (error.message) {
              return callback(error.message);
            }
            callback(error);
          }
        });
    } else {
      callback();
    }
  };

  _getERC20Balance = async (web3, asset, account, callback) => {
    if (asset.id == "eth") {
      web3.eth.getBalance(account.address).then(function (result) {
        // console.log(account.address+"\t"+result); //地址 余额
        var ethBalance = parseFloat(result) / 10 ** asset.decimals;

        callback(null, parseFloat(ethBalance));
      });
    } else {
      let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address);

      try {
        // var balance = await web3.eth.getBalance(account.address);

        var balance = await erc20Contract.methods
          .balanceOf(account.address)
          .call({ from: account.address });
        balance = parseFloat(balance) / 10 ** asset.decimals;

        callback(null, parseFloat(balance));
      } catch (ex) {
        // return callback(ex)
      }
    }
  };

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      if (asset.id === "eth" || asset.id === "bpt" || asset.id === "uni") {
        var balance = await erc20Contract.methods
          .balanceOf(account.address)
          .call({ from: account.address });
      } else if (asset.id === "kani") {
        var balanceObj = await erc20Contract.methods
          .plyr_(account.address)
          .call({ from: account.address });
        var balance = balanceObj.stake;
      } else {
        var balance = await erc20Contract.methods
          .balanceOf(asset.id, account.address)
          .call({ from: account.address });
      }
      balance = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, parseFloat(balance));
    } catch (ex) {
      // return callback(ex)
    }
  };

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    if (asset.id === "kani") {
      try {
        var earned = await erc20Contract.methods
          .cal_out(account.address)
          .call({ from: account.address });
        earned = parseFloat(earned) / 10 ** asset.decimals;

        callback(null, parseFloat(earned));
      } catch (ex) {
        // return callback(ex)
      }
    } else {
      try {
        var earned = await erc20Contract.methods
          .earned(account.address)
          .call({ from: account.address });
        earned = parseFloat(earned) / 10 ** asset.decimals;
        callback(null, parseFloat(earned));
      } catch (ex) {
        // return callback(ex)
      }
    }
  };

  _checkIfApprovalIsNeeded = async (
    asset,
    account,
    amount,
    contract,
    callback,
    overwriteAddress
  ) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);
    let erc20Contract = new web3.eth.Contract(
      config.erc20ABI,
      overwriteAddress ? overwriteAddress : asset.address
    );
    const allowance = await erc20Contract.methods
      .allowance(account.address, contract)
      .call({ from: account.address });

    const ethAllowance = web3.utils.fromWei(allowance, "ether");
    if (parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount;
      callback(null, asset);
    } else {
      callback(null, false);
    }
  };

  _callApproval = async (
    asset,
    account,
    amount,
    contract,
    last,
    callback,
    overwriteAddress
  ) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);
    let erc20Contract = new web3.eth.Contract(
      config.erc20ABI,
      overwriteAddress ? overwriteAddress : asset.address
    );
    try {
      if (last) {
        await erc20Contract.methods
          .approve(contract, web3.utils.toWei("999999999999999", "ether"))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
          });
        callback();
      } else {
        erc20Contract.methods
          .approve(contract, web3.utils.toWei("999999999999999", "ether"))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
          })
          .on("transactionHash", function (hash) {
            callback();
          })
          .on("error", function (error) {
            if (!error.toString().includes("-32601")) {
              if (error.message) {
                return callback(error.message);
              }
              callback(error);
            }
          });
      }
    } catch (error) {
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };

  stake = (payload) => {
    const account = store.getStore("account");
    const { asset, amount } = payload.content;

    this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
      if (err) {
        console.log("err", err);
        return emitter.emit(ERROR, err);
      }
      if (asset.id === "kani") {
        this._callKaniStake(asset, account, amount, (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(STAKE_RETURNED, res);
        });
      } else if (asset.id === "bpt" || asset.id === "uni") {
        this._callBanlanceKaniStake(asset, account, amount, (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(STAKE_RETURNED, res);
        });
      } else {
        this._callStake(asset, account, amount, (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }
          return emitter.emit(STAKE_RETURNED, res);
        });
      }
    });
  };

  _callBanlanceKaniStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    // const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    const ethContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, "ether");
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    ethContract.methods
      .stake(amountToSend)
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt)
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        // }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  _callKaniStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    // const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    const ethContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, "ether");
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    ethContract.methods
      .deposit(amountToSend)
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt)
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        // }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    // const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    const ethContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, "ether");
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    ethContract.methods
      .stake(asset.id, amountToSend)
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt)
        // if(confirmationNumber == 2) {
        //   dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        // }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  withdraw = (payload) => {
    const account = store.getStore("account");
    const { asset, amount } = payload.content;
    if (asset.id === "kani" || asset.id === "bpt" || asset.id === "uni") {
      this._callKaniWithdraw(asset, account, amount, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(WITHDRAW_RETURNED, res);
      });
    } else {
      this._callWithdraw(asset, account, amount, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(WITHDRAW_RETURNED, res);
      });
    }
  };

  _callKaniWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, "ether");
    if (asset.decimals != 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods
      .withdraw(amountToSend)
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, "ether");
    if (asset.decimals != 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods
      .withdraw(asset.id, amountToSend)
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getReward = (payload) => {
    const account = store.getStore("account");
    const { asset } = payload.content;

    if (asset.id === "kani") {
      this._callKaniGetReward(asset, account, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(GET_REWARDS_RETURNED, res);
      });
    } else {
      this._callGetReward(asset, account, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(GET_REWARDS_RETURNED, res);
      });
    }
  };

  _callKaniGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    yCurveFiContract.methods
      .claim()
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    yCurveFiContract.methods
      .getReward()
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  exit = (payload) => {
    const account = store.getStore("account");
    const { asset } = payload.content;

    this._callExit(asset, account, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res);
    });
  };

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    yCurveFiContract.methods
      .exit()
      .send({ from: account.address })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  propose = (payload) => {
    const account = store.getStore("account");
    const { executor, hash } = payload.content;

    this._callPropose(account, executor, hash, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(PROPOSE_RETURNED, res);
    });
  };

  _callPropose = async (account, executor, hash, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const governanceContractVersion = store.getStore(
      "governanceContractVersion"
    );
    const abi =
      governanceContractVersion === 1
        ? config.governanceABI
        : config.governanceV2ABI;
    const address =
      governanceContractVersion === 1
        ? config.governanceAddress
        : config.governanceV2Address;

    const governanceContract = new web3.eth.Contract(abi, address);

    let call = null;
    if (governanceContractVersion === 1) {
      call = governanceContract.methods.propose();
    } else {
      call = governanceContract.methods.propose(executor, hash);
    }

    call
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
      })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getProposals = (payload) => {
    // emitter.emit(GET_PROPOSALS_RETURNED)
    const account = store.getStore("account");
    const web3 = new Web3(store.getStore("web3context").library.provider);

    this._getProposalCount(web3, account, (err, proposalCount) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      let arr = Array.from(Array(parseInt(proposalCount)).keys());

      if (proposalCount == 0) {
        arr = [];
      }

      async.map(
        arr,
        (proposal, callback) => {
          this._getProposals(web3, account, proposal, callback);
        },
        (err, proposalsData) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          store.setStore({ proposals: proposalsData });
          emitter.emit(GET_PROPOSALS_RETURNED);
        }
      );
    });
  };

  _getProposalCount = async (web3, account, callback) => {
    try {
      const governanceContractVersion = store.getStore(
        "governanceContractVersion"
      );
      const abi =
        governanceContractVersion === 1
          ? config.governanceABI
          : config.governanceV2ABI;
      const address =
        governanceContractVersion === 1
          ? config.governanceAddress
          : config.governanceV2Address;

      const governanceContract = new web3.eth.Contract(abi, address);
      var proposals = await governanceContract.methods
        .proposalCount()
        .call({ from: account.address });
      callback(null, proposals);
    } catch (ex) {
      return callback(ex);
    }
  };

  _getProposals = async (web3, account, number, callback) => {
    try {
      const governanceContractVersion = store.getStore(
        "governanceContractVersion"
      );
      const abi =
        governanceContractVersion === 1
          ? config.governanceABI
          : config.governanceV2ABI;
      const address =
        governanceContractVersion === 1
          ? config.governanceAddress
          : config.governanceV2Address;

      const governanceContract = new web3.eth.Contract(abi, address);
      var proposal = await governanceContract.methods
        .proposals(number)
        .call({ from: account.address });

      proposal.executor =
        governanceContractVersion === 1
          ? "0x0000000000000000000000000000000000000000"
          : proposal.executor;
      proposal.hash = governanceContractVersion === 1 ? "na" : proposal.hash;
      proposal.quorum =
        governanceContractVersion === 1 ? "na" : proposal.quorum;
      proposal.quorumRequired =
        governanceContractVersion === 1 ? "na" : proposal.quorumRequired;

      callback(null, proposal);
    } catch (ex) {
      return callback(ex);
    }
  };

  getVoteStatus = async (payload) => {
    try {
      const account = store.getStore("account");
      const web3 = new Web3(store.getStore("web3context").library.provider);

      const governanceContract = new web3.eth.Contract(
        config.governanceV2ABI,
        config.governanceV2Address
      );

      const status = await governanceContract.methods
        .voters(account.address)
        .call({ from: account.address });

      store.setStore({ votingStatus: status });
      emitter.emit(GET_VOTE_STATUS_RETURNED, status);
    } catch (ex) {
      return emitter.emit(ERROR, ex);
    }
  };

  registerVote = (payload) => {
    const account = store.getStore("account");

    this._callRegisterVote(account, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(REGISTER_VOTE_RETURNED, res);
    });
  };

  _callRegisterVote = async (account, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const governanceContract = new web3.eth.Contract(
      config.governanceV2ABI,
      config.governanceV2Address
    );
    governanceContract.methods
      .register()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
      })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_VOTE_STATUS, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  voteFor = (payload) => {
    const account = store.getStore("account");
    const { proposal } = payload.content;

    this._callVoteFor(proposal, account, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_FOR_RETURNED, res);
    });
  };

  _callVoteFor = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const governanceContractVersion = store.getStore(
      "governanceContractVersion"
    );
    const abi =
      governanceContractVersion === 1
        ? config.governanceABI
        : config.governanceV2ABI;
    const address =
      governanceContractVersion === 1
        ? config.governanceAddress
        : config.governanceV2Address;

    const governanceContract = new web3.eth.Contract(abi, address);

    governanceContract.methods
      .voteFor(proposal.id)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
      })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  voteAgainst = (payload) => {
    const account = store.getStore("account");
    const { proposal } = payload.content;

    this._callVoteAgainst(proposal, account, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(VOTE_AGAINST_RETURNED, res);
    });
  };

  _callVoteAgainst = async (proposal, account, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const governanceContractVersion = store.getStore(
      "governanceContractVersion"
    );
    const abi =
      governanceContractVersion === 1
        ? config.governanceABI
        : config.governanceV2ABI;
    const address =
      governanceContractVersion === 1
        ? config.governanceAddress
        : config.governanceV2Address;

    const governanceContract = new web3.eth.Contract(abi, address);

    governanceContract.methods
      .voteAgainst(proposal.id)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
      })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_PROPOSALS, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getClaimableAsset = (payload) => {
    const account = store.getStore("account");
    const asset = store.getStore("claimableAsset");

    const web3 = new Web3(store.getStore("web3context").library.provider);

    async.parallel(
      [
        (callbackInnerInner) => {
          this._getClaimableBalance(web3, asset, account, callbackInnerInner);
        },
        (callbackInnerInner) => {
          this._getClaimable(web3, asset, account, callbackInnerInner);
        },
      ],
      (err, data) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        asset.balance = data[0];
        asset.claimableBalance = data[1];

        store.setStore({ claimableAsset: asset });
        emitter.emit(GET_CLAIMABLE_ASSET_RETURNED);
      }
    );
  };

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address);

    try {
      var balance = await erc20Contract.methods
        .balanceOf(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(
      config.claimABI,
      config.claimAddress
    );

    try {
      var balance = await claimContract.methods
        .claimable(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };

  claim = (payload) => {
    const account = store.getStore("account");
    const asset = store.getStore("claimableAsset");
    const { amount } = payload.content;

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res);
      });
    });
  };

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const claimContract = new web3.eth.Contract(
      config.claimABI,
      config.claimAddress
    );

    var amountToSend = web3.utils.toWei(amount, "ether");
    if (asset.decimals != 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    claimContract.methods
      .claim(amountToSend)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), "gwei"),
      })
      .on("transactionHash", function (hash) {
        console.log(hash);
        callback(null, hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log(confirmationNumber, receipt);
        if (confirmationNumber == 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} });
        }
      })
      .on("receipt", function (receipt) {
        console.log(receipt);
      })
      .on("error", function (error) {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getClaimable = (payload) => {
    const account = store.getStore("account");
    const asset = store.getStore("claimableAsset");

    const web3 = new Web3(store.getStore("web3context").library.provider);

    async.parallel(
      [
        (callbackInnerInner) => {
          this._getClaimableBalance(web3, asset, account, callbackInnerInner);
        },
        (callbackInnerInner) => {
          this._getClaimable(web3, asset, account, callbackInnerInner);
        },
      ],
      (err, data) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        asset.balance = data[0];
        asset.claimableBalance = data[1];

        store.setStore({ claimableAsset: asset });
        emitter.emit(GET_CLAIMABLE_RETURNED);
      }
    );
  };

  getYCRVRequirements = async (payload) => {
    try {
      const account = store.getStore("account");
      const web3 = new Web3(store.getStore("web3context").library.provider);

      const governanceContract = new web3.eth.Contract(
        config.governanceABI,
        config.governanceAddress
      );

      let balance = await governanceContract.methods
        .balanceOf(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** 18;

      const voteLock = await governanceContract.methods
        .voteLock(account.address)
        .call({ from: account.address });
      const currentBlock = await web3.eth.getBlockNumber();

      const returnOBJ = {
        balanceValid: balance > 1000,
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock,
      };

      emitter.emit(GET_YCRV_REQUIREMENTS_RETURNED, returnOBJ);
    } catch (ex) {
      return emitter.emit(ERROR, ex);
    }
  };

  getGovernanceV2Requirements = async (payload) => {
    try {
      const account = store.getStore("account");
      const web3 = new Web3(store.getStore("web3context").library.provider);

      const governanceContract = new web3.eth.Contract(
        config.governanceV2ABI,
        config.governanceV2Address
      );

      const voteLock = await governanceContract.methods
        .voteLock(account.address)
        .call({ from: account.address });
      const currentBlock = await web3.eth.getBlockNumber();

      const returnOBJ = {
        voteLockValid: voteLock > currentBlock,
        voteLock: voteLock,
      };

      emitter.emit(GET_GOVERNANCE_REQUIREMENTS_RETURNED, returnOBJ);
    } catch (ex) {
      return emitter.emit(ERROR, ex);
    }
  };

  getRoi = async (payload) => {
    console.log("come function roi ----");

    const account = store.getStore("account");
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const weth = config.wethAddress;
    const kani = config.kaniAddress;
    // bpt contract address : 0x0DCB7603105197333Ce123E010755F0F21C2934B
    const bptContract = new web3.eth.Contract(
      config.bpoolABI,
      config.bpoolAddress
    );
    const kaniPrice = await bptContract.methods
      .getSpotPrice(weth, kani)
      .call({ from: account.address });
    // const kaniPriceWei = web3.utils.fromWei(kaniPrice, "ether")
    // console.log("kaniPrice-----",kaniPriceWei)

    const totalKaniAmount = await bptContract.methods
      .getBalance(kani)
      .call({ from: account.address });

    const totalBptAmount = await bptContract.methods
      .totalSupply()
      .call({ from: account.address });

    const totalWethAmount = await bptContract.methods
      .getBalance(weth)
      .call({ from: account.address });

    var kPrice = web3.utils.fromWei(kaniPrice, "ether");
    const bptPrice =
      (totalKaniAmount / totalBptAmount) * kPrice +
      totalWethAmount / totalBptAmount;
    // console.log("bptPrice -------",bptPrice);

    // console.log("kani price:"+web3.utils.fromWei(kaniPrice, "ether")+" total kani amount:"+web3.utils.fromWei(totalKaniAmount, "ether")
    //     +" total bpt amount:"+web3.utils.fromWei(totalBptAmount, "ether")+" total WethAmount amount:"+web3.utils.fromWei(totalWethAmount, "ether")+" bpt price:");
    //
    //

    // pool2 contract address : 0x4fed7a096243bc7da8940835fe1a7935dace2f89
    const pool2 = new web3.eth.Contract(
      config.balanceKaniABI,
      config.balanceKaniAddress
    );
    const weeklyReward = await pool2.methods
      .initreward()
      .call({ from: account.address });

    const totalBptStaked = await pool2.methods
      .totalSupply()
      .call({ from: account.address });
    // const totalBptStaked = totalBptAmount;

    console.log(
      "weekly reward:" +
        web3.utils.fromWei(weeklyReward, "ether") +
        " totalBptStaked:"
    );
    // console.log("total stake --------",totalBptStaked)

    if (totalBptStaked > 0) {
      const yearROI =
        parseFloat(
          (((weeklyReward / totalBptStaked) * kPrice) / bptPrice) * 52 * 100
        ).toFixed(2) + "%";
      store.setStore({ roi: yearROI });
      console.log("roi grt-------", yearROI);
      return yearROI;
    } else {
      // console.log("0000------");
      store.setStore({ roi: "计算中" });
      return "----";
    }
  };

  getStableRoi = async (payload) => {
    const account = store.getStore("account");
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const weth = config.wethAddress;
    const kani = config.kaniAddress;
    const dai = config.daiAddress;
    const mUSD = config.mUSDAddress;

    const bptContract = new web3.eth.Contract(
      config.bpoolABI,
      config.bpoolAddress
    );
    const stableContract = new web3.eth.Contract(
      config.bpoolABI,
      config.governanceV2DAIAddress
    );
    const kaniPrice = await bptContract.methods
      .getSpotPrice(weth, kani)
      .call({ from: account.address });

    const mUSDWETHContract = new web3.eth.Contract(
      config.bpoolABI,
      config.mUSDWETHAddress
    );

    const wethPrice = await mUSDWETHContract.methods
      .getSpotPrice(mUSD, weth)
      .call({ from: account.address });

    // console.log("---------kaniPrice",web3.utils.fromWei(kaniPrice, "ether"));
    // console.log("---------wethPrice",web3.utils.fromWei(wethPrice, "ether"));
    var kPrice = web3.utils.fromWei(kaniPrice, "ether");
    var wPrice = web3.utils.fromWei(wethPrice, "ether");

    const totalDAIAmount = await stableContract.methods
      .totalSupply()
      .call({ from: account.address });
    var daiAmount = web3.utils.fromWei(totalDAIAmount, "ether");

    // console.log("---------totalDAIAmount",web3.utils.fromWei(totalDAIAmount, "ether"));
    const yearROI =
      parseFloat(((5000 * kPrice * wPrice) / daiAmount) * 100 * 365).toFixed(
        2
      ) + "%";
    store.setStore({ daiRoi: yearROI });
    // console.log('roi grt-------',yearROI)
    return yearROI;
  };

  getKaniRoi = async (payload) => {
    const account = store.getStore("account");
    const web3 = new Web3(store.getStore("web3context").library.provider);

    const govern = new web3.eth.Contract(
      config.governanceKaniABI,
      config.governanceKani
    );
    const dailyReward = 500000 / 365;
    const global = await govern.methods
      .global_(0)
      .call({ from: account.address });
    const totalStake = web3.utils.fromWei(global.total_stake, "ether");

    const yearROI =
      parseFloat((dailyReward / totalStake) * 365 * 100).toFixed(2) + "%";

    // console.log('total stake----'+ totalStake + "yearRoi----" + yearROI)

    store.setStore({ kaniRoi: yearROI });
    // console.log('roi grt-------',yearROI)
    return yearROI;
  };

  _getGasPrice = async () => {
    try {
      const url = "https://gasprice.poa.network/";
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString);
      if (priceJSON) {
        return priceJSON.fast.toFixed(0);
      }
      return store.getStore("universalGasPrice");
    } catch (e) {
      console.log(e);
      return store.getStore("universalGasPrice");
    }
  };

  getPool2RoiOfUniswap = async (payload) => {
    const account = store.getStore("account");
    const web3 = new Web3(store.getStore("web3context").library.provider);

    // uniswap v2 contract address : 0x65B0E3b1f36e5205e7f35781fF89f94f6A7f6C4E
    const uniswapContract = new web3.eth.Contract(
      config.uniswapABI,
      config.uniAddress
    );

    const reservers = await uniswapContract.methods
      .getReserves()
      .call({ from: account.address });
    const totalKaniAmount = web3.utils.fromWei(reservers._reserve0, "ether");
    const totalUsdtAmount = reservers._reserve1 / 1000000;
    const totalUniAmount = web3.utils.fromWei(
      await uniswapContract.methods
        .totalSupply()
        .call({ from: account.address }),
      "ether"
    );

    const kaniPrice = totalKaniAmount / totalUsdtAmount;
    const uniPrice =
      (totalKaniAmount / totalUniAmount) * kaniPrice +
      totalUsdtAmount / totalUniAmount;

    // pool2 contract address : 0x4fed7a096243bc7da8940835fe1a7935dace2f89
    const pool2 = new web3.eth.Contract(
      config.uniswapKaniABI,
      config.uniswapKaniAddress
    );
    const weeklyReward = await pool2.methods
      .initreward()
      .call({ from: account.address });
    const totalUniStaked = await pool2.methods
      .totalSupply()
      .call({ from: account.address });
    if (totalUniStaked > 0) {
      const yearROI =
        parseFloat(
          (weeklyReward / totalUniStaked) * (kaniPrice / uniPrice) * 52 * 100
        ).toFixed(2) + "%";
      store.setStore({ uniroi: yearROI });
      return yearROI;
    } else {
      store.setStore({ uniroi: "计算中" });
      return "----";
    }
  };
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter,
};
