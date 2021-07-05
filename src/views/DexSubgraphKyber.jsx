//DexSubgraphKyber
import { Button, Table, Space, Card } from "antd";
import "antd/dist/antd.css";
import fetch from "isomorphic-fetch";
import React, { useState, useEffect } from "react";
import { usePoller } from "../hooks";

function DexSubgraphKyber() {
  const txLink = (_tx, r) => `https://etherscan.io/tx/${r ? _tx.substr(0, _tx.length - 2) : _tx}`;
  const addressLink = _a => `https://etherscan.io/address/${_a}`;
  const shortTxt = _t => `${_t.substr(0, 50)}..`;

  const protocol = {
    name: "kyber",
    uri: "https://api.thegraph.com/subgraphs/name/protofire/kyber",
  };

  const protocolPrice = {
    ql: `{
        tradingPairs(first: 10) {
          id
          reserve{
            id
          }
          src {
            symbol
            name
          }
          dest {
            symbol
            name
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
          let token = `token - ${data.src.symbol} - ${data.dest.symbol}`;

          return (
            <>
              pair address -
              <br />
              <a href={pairAddressLink} target="_blank">
                {pairAddressTxt}
              </a>
              <br />
              {token}
            </>
          );
        },
      },
    ],
  };

  const protocolSwap = {
    ql: `{
        fullTrades(first: 10, orderBy:createdAtBlockTimestamp, orderDirection:desc) {
          id
          src{
            symbol
            name
          }
          dest{
            symbol
            name
          }
          rawSrcAmount
          rawDestAmount
          actualSrcAmount
          actualDestAmount
          ethWeiValue
          createdAtTransactionHash
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
          let token = `token - ${data.src.symbol} - ${data.dest.symbol}`;
          let rawamountPrice = `
              rawSrcAmount - ${parseFloat(data.rawSrcAmount).toFixed(6)}
              rawDestAmount - ${parseFloat(data.rawDestAmount).toFixed(6)}
            `;
          let actamountPrice = `
              actualSrcAmount - ${parseFloat(data.actualSrcAmount).toFixed(6)}
              actualDestAmount - ${parseFloat(data.actualDestAmount).toFixed(6)}
            `;
          return (
            <>
              trx hash -
              <br />
              <a href={trxhashLink} target="_blank">
                {trxhashTxt}
              </a>
              <br />
              {token}
              <br />
              {rawamountPrice}
              <br />
              {actamountPrice}
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

  const loadProtocolPrice = async () => {
    const { data } = await dexQLFetcher(protocol.uri, protocolPrice.ql);
    const { tradingPairs } = data || [];
    const fmtPools =
      (tradingPairs &&
        tradingPairs.map(p => {
          let obj = {
            id: p.id,
            pairAddress: p.reserve.id,
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
    const { fullTrades } = data || [];
    const fmtPools =
      (fullTrades &&
        fullTrades.map(p => {
          let obj = {
            id: p.id,
            trxhash: p.createdAtTransactionHash,
            data: p,
          };
          // console.log('data --',obj);
          return obj;
        })) ||
      [];
    if (fmtPools.length > 0) setProtocolSwapData(fmtPools);
  };
  const loadData = () => {
    loadProtocolPrice();
    loadProtocolSwap();
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
        </Card>
      </div>
      <div style={{ padding: 30 }}>...</div>
    </>
  );
}

export default DexSubgraphKyber;
