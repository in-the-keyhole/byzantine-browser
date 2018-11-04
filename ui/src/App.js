import React from "react";
import "./App.css";

import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";

import {
  Navbar,
  Nav,
  NavItem,
  FormGroup,
  FormControl,
  Button
} from "react-bootstrap";

import Home from "./Home.js";
import Channel from "./channel/channel.js";
import Metrics from "./metrics/metrics.js";
import RawBlock from "./channel/rawblock.js";
import ChannelConfig from "./configuration/channelconfig.js";

import { Provider, Subscribe } from "unstated";
import ChannelContainer from "./ChannelContainer";
import ChannelInputHandler from "./ChannelInputHandler";

const Main = ({ numberofblocks }) => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/config" component={ChannelConfig} />
      {/* <Route exact path="/channel" component={Channel} /> */}
      <Redirect exact from="/channel" to={`/channel/${numberofblocks}`} />

      <Route exact path="/channel/:blocknumber" component={Channel} />
      <Route exact path="/metrics" component={Metrics} />
      <Route
        exact
        path="/rawblock/:channelid/:blocknumber"
        component={RawBlock}
      />
    </Switch>
  </main>
);

const Layout = ({ numberofblocks, channelid }) => (
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
            <Navbar.Collapse>
              <Nav pullRight>
                {channelid && (
                  <ChannelInputHandler>
                    {({ handleSubmit, handleInputChange, error }) => (
                      <Navbar.Form pullRight>
                        <form onSubmit={handleSubmit}>
                          <FormGroup>
                            <FormControl
                              type="text"
                              name="channelid"
                              defaultValue={channelid}
                              placeholder="Channel Name"
                              onChange={handleInputChange}
                            />
                          </FormGroup>{" "}
                          <Button type="submit">Browse</Button>
                        </form>
                      </Navbar.Form>
                    )}
                  </ChannelInputHandler>
                )}
                <NavItem
                  eventKey={3}
                  href="/config"
                  to="/config"
                  componentClass={Link}
                >
                  Configuration
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
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div className="container">
          <div className="row">
            <div>
              <Main {...{ numberofblocks }} />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  </div>
);

const App = () => (
  <Provider>
    <Subscribe to={[ChannelContainer]}>
      {({ state: { blocks: numberofblocks, channelid } }) => (
        <Layout {...{ numberofblocks, channelid }} />
      )}
    </Subscribe>
  </Provider>
);

export default App;
