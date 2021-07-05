//DexSubgraphAaveV2
import { Button, Table, Space, Card } from "antd";
import "antd/dist/antd.css";
import fetch from "isomorphic-fetch";
import React, { useState, useEffect } from "react";
import { usePoller } from "../hooks";

function DexSubgraphAaveV2() {
  const txLink = (_tx, r) => `https://etherscan.io/tx/${r ? _tx.substr(0, _tx.length - 2) : _tx}`;
  const addressLink = _a => `https://etherscan.io/address/${_a}`;
  const shortTxt = _t => `${_t.substr(0, 50)}..`;

  const protocol = {
    name: "aave-v2",
    uri: "https://api.thegraph.com/subgraphs/name/aave/protocol-v2",
  };

  const protocolPrice = {
    ql: `{
        reserves(first: 10, orderBy:totalLiquidity, orderDirection:desc) {
          id
          symbol
          totalLiquidity
          price {
            oracle {
              usdPriceEth
            }
            priceInEth
            priceSource
          }
        }
      }`,
    cols: [
      {
        title: "details",
        dataIndex: "id",
        key: "id",
        render: (text, record, index) => {
          let pairAddress = record.pairAddress;
          let pairAddressLink = addressLink(pairAddress);
          let pairAddressTxt = shortTxt(pairAddress);

          let data = record.data;
          let token = `token - ${data.symbol}`;

          let price = `
              usdPriceEth - ${parseFloat(data.price.oracle.usdPriceEth).toFixed(6)}
              priceInEth - ${parseFloat(data.price.priceInEth).toFixed(6)}
            `;
          let volume = `
              totalLiquidity - ${parseFloat(data.totalLiquidity).toFixed(6)}
            `;

          return (
            <>
              pair address -
              <br />
              <a href={pairAddressLink} target="_blank">
                {pairAddressTxt}
              </a>
              <br />
              {token}
              <br />
              {volume}
            </>
          );
        },
      },
    ],
  };

  const protocolSwap = {
    ql: `{
        swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
          id
          pool{
            id
            lendingPool
          }
          reserve{
            symbol
          }
        }
      }`,
    cols: [
      {
        title: "details",
        dataIndex: "id",
        key: "id",
        render: (text, record, index) => {
          let trxhash = record.trxhash;
          let trxhashLink = txLink(trxhash);
          let trxhashTxt = shortTxt(trxhash);

          let data = record.data;
          let lendingPool = data.pool.lendingPool;
          let lendingPoolLink = addressLink(lendingPool);
          let lendingPoolTxt = shortTxt(lendingPool);
          let token = `token - ${data.reserve.symbol} `;

          return (
            <>
              trx hash -
              <br />
              <a href={trxhashLink} target="_blank">
                {trxhashTxt}
              </a>
              <br />
              lending Pool -
              <br />
              <a href={lendingPoolLink} target="_blank">
                {lendingPoolTxt}
              </a>
              <br />
              {token}
            </>
          );
        },
      },
    ],
  };

  const protocolFlashLoan = {
    ql: `{
        flashLoans(first: 1, orderBy:timestamp, orderDirection:desc) {
          id
          pool {
            id
            lendingPool
          }
          reserve {
            symbol
            price {
              priceInEth
              priceSource
            }
          }
          amount
          totalFee
          initiator {
            id
          }
        }
      }`,
    cols: [
      {
        title: "details",
        dataIndex: "id",
        key: "id",
        render: (text, record, index) => {
          let trxhash = record.trxhash;
          let trxhashLink = txLink(trxhash);
          let trxhashTxt = shortTxt(trxhash);

          let data = record.data;
          let lendingPool = data.pool.lendingPool;
          let lendingPoolLink = addressLink(lendingPool);
          let lendingPoolTxt = shortTxt(lendingPool);
          let token = `token - ${data.reserve.symbol} `;
          let amount = `amount - ${data.amount} `;
          let totalFee = `totalFee - ${data.totalFee} `;

          return (
            <>
              trx hash -
              <br />
              <a href={trxhashLink} target="_blank">
                {trxhashTxt}
              </a>
              <br />
              lending Pool -
              <br />
              <a href={lendingPoolLink} target="_blank">
                {lendingPoolTxt}
              </a>
              <br />
              {token}
              <br />
              {amount} {totalFee}
            </>
          );
        },
      },
    ],
  };

  const dexQLFetcher = async (_uri, _ql) => {
    return await fetch(_uri, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: _ql,
      }),
    }).then(response => response.json());
  };

  const [protocolPriceData, setProtocolPriceData] = useState([]);
  const [protocolSwapData, setProtocolSwapData] = useState([]);
  const [protocolFlashLoanData, setProtocolFlashLoanData] = useState([]);

  const loadProtocolPrice = async () => {
    const { data } = await dexQLFetcher(protocol.uri, protocolPrice.ql);
    const { reserves } = data || [];
    const fmtPools =
      (reserves &&
        reserves.map(p => {
          let obj = {
            id: p.id,
            pairAddress: p.id,
            data: p,
          };
          // console.log('data --',obj);
          return obj;
        })) ||
      [];
    if (fmtPools.length > 0) setProtocolPriceData(fmtPools);
  };
  const loadProtocolSwap = async () => {
    const { data } = await dexQLFetcher(protocol.uri, protocolSwap.ql);
    const { swaps } = data || [];
    const fmtPools =
      (swaps &&
        swaps.map(p => {
          let obj = {
            id: p.id,
            trxhash: p.id,
            data: p,
          };
          // console.log('data --',obj);
          return obj;
        })) ||
      [];
    if (fmtPools.length > 0) setProtocolSwapData(fmtPools);
  };
  const loadProtocolFlashLoan = async () => {
    const { data } = await dexQLFetcher(protocol.uri, protocolFlashLoan.ql);
    const { flashLoans } = data || [];
    const fmtPools =
      (flashLoans &&
        flashLoans.map(p => {
          let obj = {
            id: p.id,
            trxhash: p.id,
            data: p,
          };
          // console.log('data --',obj);
          return obj;
        })) ||
      [];
    if (fmtPools.length > 0) setProtocolFlashLoanData(fmtPools);
  };
  const loadData = () => {
    loadProtocolPrice();
    loadProtocolSwap();
    loadProtocolFlashLoan();
  };

  // useEffect(() => {
  //   loadData();
  // },[]);

  usePoller(loadData, 15000);

  return (
    <>
      <div style={{ margin: "auto", marginTop: 10, padding: 5, width: "100%" }}>
        <Card title=" ↔️ data table " style={{ borderRadius: 12 }}>
          <Table
            title={() => `${protocol.name} - price`}
            columns={protocolPrice.cols}
            rowKey="id"
            size="small"
            dataSource={protocolPriceData}
            loading={protocolPriceData.length > 0 ? false : true}
            pagination={{ defaultPageSize: 20 }}
          />
          <Table
            title={() => `${protocol.name} - swaps`}
            columns={protocolSwap.cols}
            rowKey="id"
            size="small"
            dataSource={protocolSwapData}
            loading={protocolSwapData.length > 0 ? false : true}
            pagination={{ defaultPageSize: 20 }}
          />
          <Table
            title={() => `${protocol.name} - flash loans`}
            columns={protocolFlashLoan.cols}
            rowKey="id"
            size="small"
            dataSource={protocolFlashLoanData}
            loading={protocolFlashLoanData.length > 0 ? false : true}
            pagination={{ defaultPageSize: 20 }}
          />
        </Card>
      </div>
      <div style={{ padding: 30 }}>...</div>
    </>
  );
}

export default DexSubgraphAaveV2;
