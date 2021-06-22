import { useCallback } from "react";

import useMaster from "./useMaster";
import useAccount from "./useAccount";

import { approve, getMasterContract } from "./util";

const useApprove = (lpContract) => {
  const master = useMaster();
  const account = useAccount();
  const masterContract = getMasterContract(master);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterContract, account);

      return tx;
    } catch (e) {
      return false;
    }
  }, [account, lpContract, masterContract]);

  return { onApprove: handleApprove };
};

export default useApprove;
