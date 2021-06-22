import { ethers } from "ethers";

export const getMasterContract = (master) => {
  return master && master.contracts && master.contracts.master;
};

export const getWethContract = (master) => {
  return master && master.contracts && master.contracts.weth;
};

export const approve = async (lpContract, masterContract, account) => {
  return lpContract.methods
    .approve(masterContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};
