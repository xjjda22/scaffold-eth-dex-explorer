import { Row, Col, Menu, Layout, Space } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { HeaderSt } from "./components";
import {
  DexSubgraphUniswapV2,
  DexSubgraphUniswapV3,
  DexSubgraphSushiswap,
  DexSubgraphBalancerV2,
  DexSubgraphAaveV2,
  DexSubgraphKyber,
  DexSubgraphCompoundV2,
  DexSubgraphExplorer,
} from "./views";

const { Header, Footer, Content } = Layout;
// const { ethers } = require("ethers");

// 😬 Sorry for all the console logging
// const DEBUG = true;
const showBroswerRouter = true;

function App(props) {
  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  return (
    <div className="App">
      <Layout>
        <Header
          style={{ padding: 5, position: "fixed", zIndex: 1, width: "100%", height: "auto", top: 0 }}
          className="grad_glasswater"
        >
          <HeaderSt />
          <Space></Space>
        </Header>
        <Content style={{ paddingTop: 150, paddingBottom: 170, width: "100%" }} className="">
          <BrowserRouter>
            {showBroswerRouter && (
              <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
                <Menu.Item key="/">
                  <Link
                    onClick={() => {
                      setRoute("/");
                    }}
                    to="/"
                  >
                    uniswapv2 feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/univ3">
                  <Link
                    onClick={() => {
                      setRoute("/univ3");
                    }}
                    to="/univ3"
                  >
                    uniswapv3 feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/sushi">
                  <Link
                    onClick={() => {
                      setRoute("/sushi");
                    }}
                    to="/sushi"
                  >
                    sushiswap feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/balv2">
                  <Link
                    onClick={() => {
                      setRoute("/balv2");
                    }}
                    to="/balv2"
                  >
                    balancerv2 feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/aavev2">
                  <Link
                    onClick={() => {
                      setRoute("/aavev2");
                    }}
                    to="/aavev2"
                  >
                    aavev2 feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/kyber">
                  <Link
                    onClick={() => {
                      setRoute("/kyber");
                    }}
                    to="/kyber"
                  >
                    kyber feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/compv2">
                  <Link
                    onClick={() => {
                      setRoute("/compv2");
                    }}
                    to="/compv2"
                  >
                    compoundv2 feeds
                  </Link>
                </Menu.Item>
                <Menu.Item key="/subgraph">
                  <Link
                    onClick={() => {
                      setRoute("/subgraph");
                    }}
                    to="/subgraph"
                  >
                    graph explorer
                  </Link>
                </Menu.Item>
              </Menu>
            )}
            <Switch>
              {/*<Route exact path="/">
                <div style={{ padding: 5, marginTop: 10, width: "100%", margin: "auto" }}></div>
                <Divider />
                <div style={{ padding: 5, marginTop: 10, width: "100%", margin: "auto" }}>
                  <Card title=" 🛠️ ↔️ data table " style={{ borderRadius: 12 }}></Card>

                </div>
                <div
                  style={{
                    width: 600,
                    margin: "auto",
                    marginTop: 10,
                    paddingTop: 10,
                    fontWeight: "bolder",
                    borderRadius: 12,
                  }}
                  class="grad_deeprelief"
                >
                  <div> Events:</div>
                </div>

                <div
                  style={{
                    width: 600,
                    margin: "auto",
                    marginTop: 10,
                    paddingTop: 10,
                    fontWeight: "bolder",
                    borderRadius: 12,
                  }}
                  class="grad_deeprelief"
                >
                  <div>Events:</div>
                </div>
              </Route>*/}
              <Route exact path="/">
                <DexSubgraphUniswapV2 />
              </Route>
              <Route path="/univ3">
                <DexSubgraphUniswapV3 />
              </Route>
              <Route path="/sushi">
                <DexSubgraphSushiswap />
              </Route>
              <Route path="/balv2">
                <DexSubgraphBalancerV2 />
              </Route>
              <Route path="/aavev2">
                <DexSubgraphAaveV2 />
              </Route>
              <Route path="/kyber">
                <DexSubgraphKyber />
              </Route>
              <Route path="/compv2">
                <DexSubgraphCompoundV2 />
              </Route>
              <Route path="/subgraph">
                <DexSubgraphExplorer />
              </Route>
            </Switch>
          </BrowserRouter>
        </Content>
        <Footer
          style={{ padding: 5, position: "fixed", zIndex: 1, width: "100%", bottom: 0 }}
          className="grad_glasswater"
        >
          <Row align="middle" gutter={[4, 4]}>
            <Col span={12}></Col>
            <Col span={12} style={{ textAlign: "center" }}>
              <div style={{ opacity: 0.5 }}>
                {/*<a
                  target="_blank"
                  style={{ color: "#000" }}
                  href="https://github.com/austintgriffith/scaffold-eth"
                >
                  🍴 Repo: Fork me!
                </a>
                <br />*/}
                <a
                  target="_blank"
                  style={{ color: "#000" }}
                  href="https://github.com/harryranakl/scaffold-eth-dex-explorer"
                >
                  🍴 Repo: Fork me!
                </a>
              </div>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
