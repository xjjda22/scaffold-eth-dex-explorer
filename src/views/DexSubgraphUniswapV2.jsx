//DexSubgraphUniswapV2
import { Button, Table, Space, Card } from "antd";
import "antd/dist/antd.css";
import fetch from "isomorphic-fetch";
import React, { useState, useEffect } from "react";
import { usePoller } from "../hooks";

function DexSubgraphUniswapV2() {
  const txLink = (_tx, r) => `https://etherscan.io/tx/${r ? _tx.substr(0, _tx.length - 2) : _tx}`;
  const addressLink = _a => `https://etherscan.io/address/${_a}`;
  const shortTxt = _t => `${_t.substr(0, 50)}..`;

  const protocol = {
    name: "uniswap-v2",
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  };

  const protocolPrice = {
    ql: `{
        pairs(first: 10, orderBy: txCount, orderDirection: desc) {
          id
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          token0Price
          token1Price
          volumeUSD
          reserveUSD
          reserveETH
          volumeToken0
          volumeToken1
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
          let token = `token - ${data.token0.symbol} - ${data.token1.symbol}`;
          let tokenPrice = `
              token0Price - ${parseFloat(data.token0Price).toFixed(6)}
              token0Price - ${parseFloat(data.token1Price).toFixed(6)}
            `;
          let volumeToken = `
              volumeToken0 - ${parseFloat(data.volumeToken0).toFixed(6)}
              volumeToken1 - ${parseFloat(data.volumeToken1).toFixed(6)}
            `;
          let volumeUSD = `
              volumeUSD - ${parseFloat(data.volumeUSD).toFixed(6)}
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
              {tokenPrice}
              <br />
              {volumeToken}
              <br />
              {volumeUSD}
            </>
          );
        },
      },
    ],
  };

  const protocolSwap = {
    ql: `{
        swaps (first: 10, orderBy: timestamp, orderDirection: desc){
          id
          transaction{
            id
          }
          amount0In
          amount1In
          amount0Out
          amount1Out
          pair{
            id
            token0 {
              symbol
            }
            token1 {
              symbol
            }
            token0Price
            token1Price
            volumeUSD
            volumeToken0
            volumeToken1
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
          let trxhashLink = txLink(trxhash, true);
          let trxhashTxt = shortTxt(trxhash);

          let data = record.data;
          let token = `token - ${data.pair.token0.symbol} - ${data.pair.token1.symbol}`;
          let tokenPrice = `
              token0Price - ${parseFloat(data.pair.token0Price).toFixed(6)}
              token0Price - ${parseFloat(data.pair.token1Price).toFixed(6)}
            `;
          let amountInPrice = `
              amount0In - ${parseFloat(data.amount0In).toFixed(6)}
              amount1In - ${parseFloat(data.amount1In).toFixed(6)}
            `;
          let amountOutPrice = `
              amount0Out - ${parseFloat(data.amount0Out).toFixed(6)}
              amount1Out - ${parseFloat(data.amount1Out).toFixed(6)}
            `;

          return (
            <>
              trx hash -
              <br />
              <a href={trxhash} target="_blank">
                {trxhashTxt}
              </a>
              <br />
              {token}
              <br />
              {tokenPrice}
              <br />
              {amountInPrice}
              <br />
              {amountOutPrice}
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
    const { pairs } = data || [];
    const fmtPools =
      (pairs &&
        pairs.map(p => {
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
            trxhash: p.transaction.id,
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

export default DexSubgraphUniswapV2;
