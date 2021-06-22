import { useCallback } from "react";

import useMaster from "./useMaster";
import useAccount from "./useAccount";

import { stake, getMasterContract } from "./util";

const useStake = (pid) => {
  const account = useAccount();
  const master = useMaster();

  const handleStake = useCallback(
    async (amount) => {
      await stake(getMasterContract(master), pid, amount, account);
    },
    [account, pid, master]
  );

  return { onStake: handleStake };
};

export default useStake;
