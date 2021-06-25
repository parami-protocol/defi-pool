export const CONNECTION_CONNECTED = "CONNECTION_CONNECTED";
export const CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED";

export const ERROR = "ERROR";

export const CONFIGURE = "CONFIGURE";
export const CONFIGURE_RETURNED = "CONFIGURE_RETURNED";

export const STAKE = "STAKE";
export const STAKE_RETURNED = "STAKE_RETURNED";

export const GET_REWARDS = "GET_REWARDS";
export const GET_REWARDS_RETURNED = "GET_REWARDS_RETURNED";

export const EXIT = "EXIT";
export const EXIT_RETURNED = "EXIT_RETURNED";

export const WITHDRAW = "WITHDRAW";
export const WITHDRAW_RETURNED = "WITHDRAW_RETURNED";

export const GET_BALANCES = "GET_BALANCES";
export const GET_BALANCES_RETURNED = "GET_BALANCES_RETURNED";

export const GET_BALANCES_PERPETUAL = "GET_BALANCES_PERPETUAL";
export const GET_BALANCES_PERPETUAL_RETURNED =
  "GET_BALANCES_PERPETUAL_RETURNED";

export const PROPOSE = "PROPOSE";
export const PROPOSE_RETURNED = "PROPOSE_RETURNED";

export const GET_PROPOSALS = "GET_PROPOSALS";
export const GET_PROPOSALS_RETURNED = "GET_PROPOSALS_RETURNED";

export const VOTE_FOR = "VOTE_FOR";
export const VOTE_FOR_RETURNED = "VOTE_FOR_RETURNED";

export const VOTE_AGAINST = "VOTE_AGAINST";
export const VOTE_AGAINST_RETURNED = "VOTE_AGAINST_RETURNED";

export const GET_CLAIMABLE_ASSET = "GET_CLAIMABLE_ASSET";
export const GET_CLAIMABLE_ASSET_RETURNED = "GET_CLAIMABLE_ASSET_RETURNED";

export const CLAIM = "CLAIM";
export const CLAIM_RETURNED = "CLAIM_RETURNED";

export const GET_CLAIMABLE = "GET_CLAIMABLE";
export const GET_CLAIMABLE_RETURNED = "GET_CLAIMABLE_RETURNED";

export const GET_YCRV_REQUIREMENTS = "GET_YCRV_REQUIREMENTS";
export const GET_YCRV_REQUIREMENTS_RETURNED = "GET_YCRV_REQUIREMENTS_RETURNED";

export const GET_GOVERNANCE_REQUIREMENTS = "GET_GOVERNANCE_REQUIREMENTS";
export const GET_GOVERNANCE_REQUIREMENTS_RETURNED =
  "GET_GOVERNANCE_REQUIREMENTS_RETURNED";

export const GOVERNANCE_CONTRACT_CHANGED = "GOVERNANCE_CONTRACT_CHANGED";

export const REGISTER_VOTE = "REGISTER_VOTE";
export const REGISTER_VOTE_RETURNED = "REGISTER_VOTE_RETURNED";

export const GET_VOTE_STATUS = "GET_VOTE_STATUS";
export const GET_VOTE_STATUS_RETURNED = "GET_VOTE_STATUS_RETURNED";

export const LOCK = "LOCK";
export const LOCK_RETURNED = "LOCK_RETURNED";

export const GET_LIQUIDITY_BALANCES = "GET_LIQUIDITY_BALANCES";
export const GET_LIQUIDITY_BALANCES_RETURNED =
  "GET_LIQUIDITY_BALANCES_RETURNED";

export const GETROI = "GETROI";
export const GETDAIROI = "GETDAIROI";
export const GETKANIROI = "GETKANIROI";
export const GETUNIKANIROI = "GETUNIKANIROI";

export const contractAddresses = {
  ad3: {
    1: "",
    4: "0xaa54f12feecf6653b82a297b77a1b577d4a13666",
  },
  weth: {
    1: "",
    4: "0xdf032bc4b9dc2782bb09352007d4c57b75160b15",
  },
  usdt: {
    1: "",
    4: "0xd92e713d051c37ebb2561803a3b5fbabc4962431",
  },
  usdc: {
    1: "",
    4: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
  },
  master: {
    1: "",
    4: "0xBe754C2AeB20b35Ea1705FE53dde9A2F4313cB3B",
  },
};

export const pairs = [
  {
    pid: 0,
    lpAddresses: {
      1: "",
      4: "0xc36442b4a4522e871399cd717abdd847ab11fe88",
    },
    tokenAddresses: {
      1: "",
      4: "0xaa54f12feecf6653b82a297b77a1b577d4a13666",
    },
    name: "WETH-AD3",
    symbol: "WETH-AD3 LP",
    tokenSymbol: "AD3",
    icon: "💰",
  },
  // {
  //   pid: 1,
  //   lpAddresses: {
  //     1: "",
  //     4: "",
  //   },
  //   tokenAddresses: {
  //     1: "",
  //     4: "",
  //   },
  //   name: "USDT-AD3",
  //   symbol: "USDT-AD3 LP",
  //   tokenSymbol: "AD3",
  //   icon: "💰",
  // },
  // {
  //   pid: 2,
  //   lpAddresses: {
  //     1: "",
  //     4: "",
  //   },
  //   tokenAddresses: {
  //     1: "",
  //     4: "",
  //   },
  //   name: "USDC-AD3",
  //   symbol: "USDC-AD3 LP",
  //   tokenSymbol: "AD3",
  //   icon: "💰",
  // },
];
