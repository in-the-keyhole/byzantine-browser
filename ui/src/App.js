import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import config from "react-global-configuration";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Button
} from "react-bootstrap";

import Home from "./Home.js";
import Channel from "./channel/channel.js";
import Metrics from "./metrics/metrics.js";
import RawBlock from "./channel/rawblock.js";
import SelectChannel from "./SelectChannel.js";

import { Provider } from "unstated";

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/select" component={SelectChannel} />
      <Route exact path="/channel" component={Channel} />
      <Route exact path="/metrics" component={Metrics} />
      <Route
        exact
        path="/rawblock/:channelid/:blocknumber"
        component={RawBlock}
      />
    </Switch>
  </main>
);

const Layout = () => (
  <div>
    <BrowserRouter>
      <div>
        <div>
          <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">
                  KHS Blockchain Browser&#123;for Hyperledger&#125;
                </a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav pullRight>
              <NavItem
                eventKey={3}
                href="/select"
                to="/select"
                componentClass={Link}
              >
                SelectChannel
              </NavItem>
              <NavItem
                eventKey={3}
                href="/channel"
                to="/channel"
                componentClass={Link}
              >
                Blocks
              </NavItem>
              <NavItem
                eventKey={5}
                href="/metrics"
                to="/metrics"
                componentClass={Link}
              >
                Metrics
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <div className="container">
          <div className="row">
            <div>
              <Main />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  </div>
);

const App = () => (
  <Provider>
    <Layout />
  </Provider>
);

export default App;
