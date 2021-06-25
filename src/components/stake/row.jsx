import React, { useState, useEffect, useCallback } from "react";

import {
  Button,
  TextField,
  TableCell,
  TableRow,
  Collapse,
  Box,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import useMaster from "../../hooks/useMaster";
import useAllowance from "../../hooks/useAllowance";
import useApprove from "../../hooks/useApprove";
import useStake from "../../hooks/useStake";
import useUnstake from "../../hooks/useUnstake";
import useReward from "../../hooks/useReward";
import useEarned from "../../hooks/useEarned";

const Row = ({ row, addLiquidity }) => {
  const [open, setOpen] = useState(false);
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [pendingStake, setPendingStake] = useState(false);
  const [pendingUnstake, setPendingUnstake] = useState(false);
  const [pendingClaim, setPendingClaim] = useState(false);

  const allowance = useAllowance(row.lpContract);
  // const earned = useEarned(row.pid);
  const earned = 0;

  const { onApprove } = useApprove(row.lpContract);
  const { onStake } = useStake(row.pid);
  const { onUnstake } = useUnstake(row.pid);
  const { onReward } = useReward(row.pid);

  // TODO
  // balance
  const balance = 0;
  // staked
  const staked = 0;
  // apy
  const apy = 0;

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);

      const txHash = await onApprove();

      console.log(txHash);
      if (!txHash) {
        setRequestedApproval(false);
      }
    } catch (e) {
      console.log(e);
    }
  }, [onApprove]);

  const handleStake = useCallback(
    async (amount) => {
      try {
        setPendingStake(true);

        await onStake(amount);

        setPendingStake(false);
      } catch (e) {
        console.error(e);
      }
    },
    [onStake]
  );

  const handleUnstake = useCallback(
    async (amount) => {
      try {
        setPendingUnstake(true);

        await onUnstake(amount);

        setPendingUnstake(false);
      } catch (e) {
        console.error(e);
      }
    },
    [onUnstake]
  );

  const handleClaim = useCallback(
    async (amount) => {
      try {
        setPendingClaim(true);

        await onReward(amount);

        setPendingClaim(false);
      } catch (e) {
        console.error(e);
      }
    },
    [onReward]
  );

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{earned}</TableCell>
        <TableCell>{balance}</TableCell>
        <TableCell>{staked}</TableCell>
        <TableCell>{apy}</TableCell>
        <TableCell>
          <Button className="stake-table-btn" onClick={addLiquidity}>
            Add
          </Button>
        </TableCell>
        <TableCell align="right">
          <IconButton
            className="stake-table-btn"
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <div className="box-mod">
                <div className="hd">
                  <div>{earned} AD3</div>
                  <Button
                    disabled={!earned}
                    className="stake-table-btn"
                    onClick={handleClaim}
                  >
                    {pendingClaim ? "Pending Confirmation" : "Claim"}
                  </Button>
                </div>

                <div className="bd">
                  <div className="hd">
                    <div>Balance {balance}</div>
                    <div>Max</div>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Balance"
                    variant="outlined"
                  />
                  {!allowance ? (
                    <Button className="stake-table-btn" onClick={handleApprove}>
                      {requestedApproval ? "Pending Confirmation" : "Approve"}
                    </Button>
                  ) : (
                    <Button
                      disabled={!balance}
                      className="stake-table-btn"
                      onClick={handleStake}
                    >
                      {pendingStake ? "Pending Confirmation" : "Stake"}
                    </Button>
                  )}
                </div>

                <div className="ft">
                  <div className="hd">
                    <div>Staked {staked}</div>
                    <div>Max</div>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Staked"
                    variant="outlined"
                  />
                  <Button
                    disabled={!staked}
                    className="stake-table-btn"
                    onClick={handleUnstake}
                  >
                    {pendingUnstake ? "Pending Confirmation" : "Unstake"}
                  </Button>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const Rows = (props) => {
  const master = useMaster();

  const pools = master?.contracts.pools;

  return (
    <>
      {pools
        ? pools.map((row) => (
            <Row
              key={row.name}
              row={row}
              addLiquidity={() => props.setLiquidityModalStatus(true)}
            />
          ))
        : null}
    </>
  );
};

export default Rows;
