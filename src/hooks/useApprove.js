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
      await approve(lpContract, masterContract, account.address);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [account, lpContract, masterContract]);

  return { onApprove: handleApprove };
};

export default useApprove;
