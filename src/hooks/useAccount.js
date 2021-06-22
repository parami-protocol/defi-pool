import { useState, useEffect } from "react";

import Store from "../stores";

const useAccount = () => {
  const [account, setAccount] = useState();
  const store = Store.store;

  useEffect(() => {
    const account = store.getStore("account");

    setAccount(account);
  }, [store]);

  return account;
};

export default useAccount;
