import { useState, useEffect, useCallback } from "react";

import useMaster from "./useMaster";
import useAccount from "./useAccount";

import { getEarned, getMasterContract } from "./util";

const useEarned = (pid) => {
  const account = useAccount();
  const master = useMaster();
  const masterContract = getMasterContract(master);

  const [earned, setEarned] = useState();

  const fetchEarend = useCallback(async () => {
    const earned = await getEarned(masterContract, pid, account);

    setEarned(earned.toNumber());
  }, [account, masterContract, pid]);

  useEffect(() => {
    if (account && master) {
      fetchEarend();
    }
  });

  return earned;
};

export default useEarned;
