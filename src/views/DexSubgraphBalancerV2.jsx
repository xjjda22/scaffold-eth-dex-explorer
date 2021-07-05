//DexSubgraphBalancerV2
import { Button, Table, Space, Card } from "antd";
import "antd/dist/antd.css";
import fetch from "isomorphic-fetch";
import React, { useState, useEffect } from "react";
import { usePoller } from "../hooks";

function DexSubgraphBalancerV2() {
  const txLink = (_tx, r) => `https://etherscan.io/tx/${r ? _tx.substr(0, _tx.length - 2) : _tx}`;
  const addressLink = _a => `https://etherscan.io/address/${_a}`;
  const shortTxt = _t => `${_t.substr(0, 50)}..`;

  const protocol = {
    name: "balancer-v2",
    uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2",
  };

  const protocolPrice = {
    ql: `{
        pools(first: 10, orderBy: totalLiquidity, orderDirection: desc) {
          id
          tokens {
            symbol
          }
          swapFee
          totalLiquidity
          totalSwapVolume
          tx
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
          let token = `token - ${data.tokens.map(t => t.symbol).join(" - ")}`;

          let volume = `
              totalLiquidity - ${parseFloat(data.totalLiquidity).toFixed(6)}
              totalSwapVolume - ${parseFloat(data.totalSwapVolume).toFixed(6)}
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
          tokenIn
          tokenOut
          tokenInSym
          tokenOutSym
          tokenAmountIn
          tokenAmountOut
          tx
          poolId{
            address
            poolType
            tokens{
              symbol
            }
            totalLiquidity
            totalSwapVolume
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
          let poolAdd = data.poolId.address;
          let poolAddLink = addressLink(poolAdd);
          let poolAddTxt = shortTxt(poolAdd);
          let token = `token - ${data.tokenInSym} - ${data.tokenOutSym}`;
          let amountPrice = `
              tokenAmountIn - ${parseFloat(data.tokenAmountIn).toFixed(6)}
              tokenAmountOut - ${parseFloat(data.tokenAmountOut).toFixed(6)}
            `;
          let poolToken = `
              pool tokens - ${data.poolId.tokens.map(t => t.symbol).join(" - ")}
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
              {amountPrice}
              <br />
              pool address -
              <br />
              <a href={poolAddLink} target="_blank">
                {poolAddTxt}
              </a>
              <br />
              {poolToken}
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
    const { pools } = data || [];
    const fmtPools =
      (pools &&
        pools.map(p => {
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
            trxhash: p.tx,
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

export default DexSubgraphBalancerV2;
