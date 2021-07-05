//DexSubgraphExplorer
import { Radio, Space, Card, Input } from "antd";
import "antd/dist/antd.css";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import fetch from "isomorphic-fetch";
import React, { useState } from "react";

const { Search } = Input;

function DexSubgraphExplorer() {
  const dexQLFetcher = _ql => {
    return fetch(uri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_ql),
    }).then(response => response.json());
  };

  const uriArr = [
    {
      name: "uniswap-v2",
      uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
      ql: `{
        pairs(first: 20, orderBy: txCount, orderDirection: desc) {
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
          title: "token",
          dataIndex: "token",
          key: "token",
          width: 200,
        },
        {
          title: "token0Price",
          dataIndex: "token0Price",
          key: "token0Price",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.token0Price - b.token0Price,
        },
        {
          title: "token1Price",
          dataIndex: "token1Price",
          key: "token1Price",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.token1Price - b.token1Price,
        },
        {
          title: "volumeUSD",
          dataIndex: "volumeUSD",
          key: "volumeUSD",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.volumeUSD - b.volumeUSD,
        },
      ],
    },
    {
      name: "uniswap-v3",
      uri: "https://api.thegraph.com/subgraphs/name/drcyph3r/uniswap-v3",
      ql: `{
        pools(first: 20, orderBy: txCount, orderDirection: desc) {
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
      }`,
      cols: [
        {
          title: "token",
          dataIndex: "token",
          key: "token",
          width: 200,
        },
        {
          title: "token0Price",
          dataIndex: "token0Price",
          key: "token0Price",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.token0Price - b.token0Price,
        },
        {
          title: "token1Price",
          dataIndex: "token1Price",
          key: "token1Price",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.token1Price - b.token1Price,
        },
        {
          title: "volumeUSD",
          dataIndex: "volumeUSD",
          key: "volumeUSD",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.volumeUSD - b.volumeUSD,
        },
      ],
    },
    {
      name: "sushiswap-v2",
      uri: "https://api.thegraph.com/subgraphs/name/sushiswap/exchange",
      ql: `{
        pairs(first: 20, orderBy: txCount, orderDirection: desc) {
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
          title: "token",
          dataIndex: "token",
          key: "token",
          width: 200,
        },
        {
          title: "token0Price",
          dataIndex: "token0Price",
          key: "token0Price",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.token0Price - b.token0Price,
        },
        {
          title: "token1Price",
          dataIndex: "token1Price",
          key: "token1Price",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.token1Price - b.token1Price,
        },
        {
          title: "volumeUSD",
          dataIndex: "volumeUSD",
          key: "volumeUSD",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.volumeUSD - b.volumeUSD,
        },
      ],
    },
    {
      name: "compound-v2",
      uri: "https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2",
      ql: `{
        markets (first: 20, orderBy: totalSupply) {
          id
          symbol
          underlyingPrice
          underlyingPriceUSD
          totalSupply
        }
      }`,
      cols: [
        {
          title: "token",
          dataIndex: "token",
          key: "token",
          width: 200,
        },
        {
          title: "tokenPrice",
          dataIndex: "underlyingPrice",
          key: "underlyingPrice",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.underlyingPrice - b.underlyingPrice,
        },
        {
          title: "tokenPriceUSD",
          dataIndex: "underlyingPriceUSD",
          key: "underlyingPriceUSD",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.underlyingPriceUSD - b.underlyingPriceUSD,
        },
        {
          title: "totalSupply",
          dataIndex: "totalSupply",
          key: "totalSupply",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.totalSupply - b.totalSupply,
        },
      ],
    },
    {
      name: "synthetix",
      uri: "https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix",
      ql: `{
        transfers(first: 20) {
          id
          from
          to
          value
        }
      }`,
    },
    {
      name: "balancer-v2",
      uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2",
      ql: `{
        pools(first: 20, orderBy:totalLiquidity, orderDirection:desc) {
          id
          tokens{
            symbol
          }
          swapFee
        }
      }`,
    },
    {
      name: "aave-v2",
      uri: "https://api.thegraph.com/subgraphs/name/aave/protocol-v2",
      ql: `{
        reserves(first: 20, orderBy:totalLiquidity, orderDirection:desc) {
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
          title: "token",
          dataIndex: "token",
          key: "token",
          width: 200,
        },
        {
          title: "tokenPrice",
          dataIndex: "priceInEth",
          key: "priceInEth",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.priceInEth - b.priceInEth,
        },
        {
          title: "tokenPriceUSD",
          dataIndex: "usdPriceEth",
          key: "usdPriceEth",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.usdPriceEth - b.usdPriceEth,
        },
        {
          title: "totalLiquidity",
          dataIndex: "totalLiquidity",
          key: "totalLiquidity",
          defaultSortOrder: "descend",
          sorter: (a, b) => a.totalLiquidity - b.totalLiquidity,
        },
      ],
    },
    {
      name: "dydx",
      uri: "https://api.thegraph.com/subgraphs/name/graphitetools/dydx",
      ql: `{
        markets (first: 10) {
          token {
            address
          }
          supplyRate
          borrowRate
        }
      }`,
    },
    {
      name: "kyber",
      uri: "https://api.thegraph.com/subgraphs/name/protofire/kyber",
      ql: `{
          tradingPairs (first: 10) {
          src{
            symbol
          name
          }
          dest{
            symbol
            name
          }
        }
      }`,
    },
    {
      name: "curve",
      uri: "https://api.thegraph.com/subgraphs/name/protofire/curve",
      ql: `{
        pools (first: 10, orderBy: addedAt) {
          coins {
            token {
              symbol
            }
            balance
          }
          underlyingCoins {
            token {
              symbol
            }
          }
        }
      }`,
    },
    {
      name: "chainlink",
      uri: "https://api.thegraph.com/subgraphs/name/tomafrench/chainlink",
      ql: `{
        ethStarts: priceFeeds (first: 10, where: {assetPair_starts_with: "ETH"}) {
          id
          assetPair
          decimals
          latestPrice {
            price
          }
        }
        ethEnds: priceFeeds (first: 10, where: {assetPair_ends_with: "ETH"}) {
          id
          assetPair
          decimals
          latestPrice {
            price
          }
        }
        ethContains: priceFeeds (first: 10, where: {assetPair_contains: "ETH"}) {
          id
          assetPair
          decimals
          latestPrice {
            price
          }
        }
      }`,
    },
    {
      name: "loopring-v2",
      uri: "https://api.thegraph.com/subgraphs/name/protofire/loopring-exchange-v2",
      ql: `{
        pairs{
          token0{
            symbol
          }
          token1 {
            symbol
          }
          token0Price
          token1Price
        }
      }`,
    },
    {
      name: "oneinch",
      uri: "https://api.thegraph.com/subgraphs/name/krboktv/oneinch-liquidity-protocol",
      ql: `{
        tradingPairs(first:10,orderBy:tradeCount,orderDirection:desc) {
          fromToken {
            id
            symbol
          }
          toToken {
            id
            symbol
          }
          tradeVolume
        }
      }`,
    },
    {
      name: "bancor",
      uri: "https://api.thegraph.com/subgraphs/name/blocklytics/bancor",
      ql: `{
        swaps(first: 1, orderBy: timestamp, orderDirection: desc) {
          id
          fromToken {
            symbol
          }
          toToken {
            symbol
          }
          price
          amountPurchased
          amountReturned
          transaction {
            id
          }
        }
      }`,
    },
  ];

  const [index, setIndex] = useState(0);
  const [uri, setUri] = useState(uriArr[0].uri);
  const [ql, setQl] = useState(uriArr[0].ql);

  const onChangeUri = e => {
    const i = e.target.value;
    console.log("radio checked", e.target.value);
    setIndex(i);
    setUri(uriArr[i].uri);
    setQl(uriArr[i].ql);
  };
  const onSetUri = e => {
    console.log("set url", e);
    setUri(e);
    setQl("");
  };

  return (
    <>
      <div style={{ margin: "auto", marginTop: 30 }}>
        <Card
          title="choose and play some top dex subgraph:"
          style={{ margin: "auto", marginTop: 10, paddingBottom: 10 }}
        >
          <h3>current dex url: {uri} </h3>
          <Radio.Group onChange={onChangeUri} value={index} buttonStyle="solid">
            {uriArr &&
              uriArr.map((u, i) => {
                return (
                  <Radio.Button key={i} value={i} style={{ margin: 10 }}>
                    {u.name}
                  </Radio.Button>
                );
              })}
          </Radio.Group>

          <h3>
            reference site:
            <a href="https://thegraph.com/explorer/" target="_blank" rel="noopener noreferrer">
              https://thegraph.com/explorer/
            </a>
          </h3>
          <Search placeholder="input subgraph url" allowClear enterButton="set url" onSearch={onSetUri} />

          <div style={{ margin: "auto", marginTop: 20, height: 500, border: "1px solid #888888", textAlign: "left" }}>
            <GraphiQL fetcher={dexQLFetcher} docExplorerOpen query={ql} />
          </div>
        </Card>
      </div>

      <div style={{ padding: 30 }}>...</div>
    </>
  );
}

export default DexSubgraphExplorer;
