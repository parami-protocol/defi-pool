import { useState, useEffect, useCallback } from "react";
import BigNumber from "bignumber.js";

import useMaster from "./useMaster";
import Store from "../stores";

const useEarned = () => {
  const store = Store.store;
  const account = store.getStore("account");
  const master = useMaster();

  const [earned, setEarned] = useState(new BigNumber(0));

  const fetchEarend = useCallback(() => {
    setEarned(0);
  }, []);

  useEffect(() => {
    if (account && master) {
      fetchEarend();
    }
  });

  return earned;
};

export default useEarned;
