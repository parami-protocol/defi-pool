import BigNumber from "bignumber.js";
import { ethers } from "ethers";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

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
