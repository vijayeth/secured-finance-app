import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  Container,
  Grid,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ReactVirtualizedTable from "./component/ReactVirtualizedTable";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    paddingTop: theme.spacing(5),
    flexGrow: 1,
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  midPrice: {
    fontSize: "1rem",
    border: "1px dashed white",
    padding: theme.spacing(1),
    fontWeight: theme.typography.fontWeightBold,
    textAlign: "center",
  },
}));

//del
const type={
  'b':'Borrow',
  'l':'Lend'
}

export default function Duration(props) {
  let { duration } = useParams();
  const classes = useStyles();
  const { orderbook, currentMidrate, setcurrType, setselectedRow } = props;

  const borrows = orderbook.borrowerbook.sort((a, b) => a.rate - b.rate);
  const lends = orderbook.lenderbook.sort((a, b) => b.rate - a.rate);

  const average = borrows.length ? (borrows[0].rate + lends[0].rate) / 2 : 0;

  console.log("borrows", borrows);

  const selRow = (rowData) => {
    console.log("setselectedRow x", rowData);
    setselectedRow(rowData);
  };

  return (
    <div className={classes.root}>
      <Container>
        <div style={{ marginBottom: 50 }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "60%",
                textAlign: "start",
                padding: "5px 10px",
                border: "0.5px solid white",
              }}
            >
              Amount
            </div>
            <div
              style={{
                width: "40%",
                textAlign: "start",
                padding: 5,
                border: "0.5px solid white",
              }}
            >
              Rate
            </div>
          </div>
        </div>
      </Container>
      <Grid container spacing={3}>
        {/* <Grid item xs={12}>
          <div className={classes.midPrice}>{currentMidrate}%</div>
        </Grid> */}
        <Grid item xs={6}>
          <div style={{ fontSize: "1.5rem" }}>Borrowersx</div>
          <ReactVirtualizedTable
            rows={borrows}
            columns={[
              {
                width: 100,
                label: "Amount",
                dataKey: "amount",
                flexGrow: 1,
              },
              {
                width: 120,
                label: "Rate %",
                dataKey: "rate",
                numeric: true,
              },
            ]}
            type={"lend"}
            onRowClick={selRow}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setcurrType("lend");
            }}
          >
            Lend
          </Button>
        </Grid>
        <Grid item xs={6}>
          <div style={{ fontSize: "1.5rem" }}>Lenders</div>
          <ReactVirtualizedTable
            rows={lends}
            columns={[
              {
                width: 100,
                label: "Amount",
                dataKey: "amount",
                flexGrow: 1,
              },
              {
                width: 120,
                label: "Rate %",
                dataKey: "rate",
                numeric: true,
              },
            ]}
            onRowClick={selRow}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setcurrType("borrow");
            }}
          >
            Borrow
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
