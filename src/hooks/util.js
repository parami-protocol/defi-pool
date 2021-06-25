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
  console.log(lpContract);
  return lpContract.methods
    .setApprovalForAll(masterContract.options.address, true)
    .send({ from: account });
};

export const getAllowance = async (lpContract, user, spender) => {
  try {
    const allowance = await lpContract.methods
      .isApprovedForAll(user, spender)
      .call();

    return allowance;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getAd3Supply = async (master) => {
  return new BigNumber(await master.contracts.ad3.methods.totalSupply().call());
};

export const stake = async (masterContract, pid, amount, account) => {
  return masterContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const unstake = async (masterContract, pid, amount, account) => {
  return masterContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const harvest = async (masterContract, pid, account) => {
  return masterContract.methods
    .deposit(pid, "0")
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const getStaked = async (masterContract, pid, account) => {
  try {
    const { amount } = await masterContract.methods
      .userInfo(pid, account)
      .call();

    return new BigNumber(amount);
  } catch (e) {
    return new BigNumber(0);
  }
};

export const getAd3Price = async (master) => {
  const price = await master.contracts.ad3.methods.getPrice().call();

  return new BigNumber(price);
};

export const getEarned = async (masterContract, pid, account) => {
  const amount = await masterContract.methods.pendingShare(pid, account).call();

  return new BigNumber(amount);
};

export const getLptokenBalance = async (lpContract, account) => {
  const balance = await lpContract.methods.balanceOf(account).call();

  return new BigNumber(balance);
};
