import { useState, useEffect } from "react";

import Store from "../stores";
import Master from "../constants/master";

const useMaster = () => {
  const store = Store.store;
  const account = store.getStore("account");

  const [master, setMaster] = useState();

  window.master = master;

  useEffect(() => {
    const {
      library: { provider },
    } = store.getStore("web3context");

    const chainId = 4;

    const masterLib = new Master(provider, chainId, {
      defaultAccount: account?.address,
      defaultConfirmations: 1,
      autoGasMultiplier: 1.5,
      testing: false,
      defaultGas: "6000000",
      defaultGasPrice: "1000000000000",
      accounts: [],
      ethereumNodeTimeout: 10000,
    });

    setMaster(masterLib);
  }, [account, store]);

  return master;
};

export default useMaster;
