import { useCallback } from "react";

import useMaster from "./useMaster";
import useAccount from "./useAccount";

import { unstake, getMasterContract } from "./util";

const useUnstake = (pid) => {
  const account = useAccount();
  const master = useMaster();
  const masterContract = getMasterContract(master);

  const handleUnstake = useCallback(
    async (amount) => {
      await unstake(masterContract, pid, amount, account);
    },
    [masterContract, pid, account]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
