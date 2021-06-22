import React, { useState, useEffect, useCallback } from "react";

import {
  Typography,
  Button,
  // Card,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  CircularProgress,
  Collapse,
  Box,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import useMaster from "../../hooks/useMaster";

const Row = ({ row, addLiquidity }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.earned}</TableCell>
        <TableCell>{row.balance}</TableCell>
        <TableCell>{row.staked}</TableCell>
        <TableCell>{row.apy}</TableCell>
        <TableCell>
          <Button className="stake-table-btn" onClick={addLiquidity}>
            Add
          </Button>
        </TableCell>
        <TableCell>
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
                  <div>{row.earned} AD3</div>
                  <Button className="stake-table-btn">Claim</Button>
                </div>

                <div className="bd">
                  <div className="hd">
                    <div>Balance {row.balance}</div>
                    <div>Max</div>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Balance"
                    variant="outlined"
                  />
                  <Button className="stake-table-btn">Approve</Button>
                </div>

                <div className="ft">
                  <div className="hd">
                    <div>Staked {row.staked}</div>
                    <div>Max</div>
                  </div>
                  <TextField
                    id="outlined-basic"
                    label="Staked"
                    variant="outlined"
                  />
                  <Button className="stake-table-btn">Unstake</Button>
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
