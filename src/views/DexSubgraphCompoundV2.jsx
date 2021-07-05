//DexSubgraphCompoundV2
import { Button, Table, Space, Card } from "antd";
import "antd/dist/antd.css";
import fetch from "isomorphic-fetch";
import React, { useState, useEffect } from "react";
import { usePoller } from "../hooks";

function DexSubgraphCompoundV2() {
  const txLink = (_tx, r) => `https://etherscan.io/tx/${r ? _tx.substr(0, _tx.length - 3) : _tx}`;
  const addressLink = _a => `https://etherscan.io/address/${_a}`;
  const shortTxt = _t => `${_t.substr(0, 50)}..`;

  const protocol = {
    name: "compound-v2",
    uri: "https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2",
  };

  const protocolPrice = {
    ql: `{
        markets (first: 10, orderBy: totalSupply) {
          id
          symbol
          underlyingPrice
          underlyingPriceUSD
          totalSupply
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
          let token = `token - ${data.symbol} `;
          let price = `price eth - ${data.underlyingPrice} - price usd - ${data.underlyingPriceUSD} `;
          let supply = `totalSupply - ${data.totalSupply} `;

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
              {price}
              <br />
              {supply}
            </>
          );
        },
      },
    ],
  };

  const protocolSwap = {
    ql: `{
        transferEvents(first: 10, orderBy: blockNumber) {
          id
          amount
          from
          to
          cTokenSymbol
          blockNumber
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
          let token = `token - ${data.cTokenSymbol} `;
          let amount = `
              amount - ${parseFloat(data.amount).toFixed(6)}
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
              {amount}
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
    const { markets } = data || [];
    const fmtPools =
      (markets &&
        markets.map(p => {
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
    const { transferEvents } = data || [];
    const fmtPools =
      (transferEvents &&
        transferEvents.map(p => {
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

export default DexSubgraphCompoundV2;
