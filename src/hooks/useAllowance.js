import { useState, useEffect, useCallback } from "react";
import BigNumber from "bignumber.js";

import useAccount from "./useAccount";
import useMaster from "./useMaster";

import { getMasterContract } from "./util";

const getAllowance = async (lpContract, user, spender) => {
  try {
    const allowance = await lpContract.methods.allowance(user, spender).call();
    return allowance;
  } catch (e) {
    return "0";
  }
};

const useAllowance = (lpContract) => {
  const account = useAccount();
  const master = useMaster();

  const [allowance, setAllowance] = useState(new BigNumber(0));

  const masterContract = getMasterContract(master);

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      account,
      masterContract.options.address
    );
    setAllowance(new BigNumber(allowance));
  }, [account, masterContract, lpContract]);

  useEffect(() => {
    if (account && masterContract && lpContract) {
      fetchAllowance();
    }

    let refreshInterval = setInterval(fetchAllowance, 10000);

    return () => clearInterval(refreshInterval);
  }, [account, masterContract, lpContract, fetchAllowance]);

  return allowance;
};

export default useAllowance;
