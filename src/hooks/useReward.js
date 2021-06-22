import { useCallback } from "react";

import useMaster from "./useMaster";
import useAccount from "./useAccount";

import { harvest, getMasterContract } from "./util";

const useReward = (pid) => {
  const account = useAccount();
  const master = useMaster();
  const masterContract = getMasterContract(master);

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterContract, pid, account);

    return txHash;
  }, [masterContract, pid, account]);

  return { onReward: handleReward };
};

export default useReward;
