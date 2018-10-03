/*** 
Copyright 2018 Keyhole Software LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import Transactions from "./transactions.js";
import Blocks from "./blocks.js";
import Info from "./info.js";

import { Redirect } from "react-router";
import { Subscribe } from "unstated";
import ChannelContainer from "../ChannelContainer.js";

const Metrics = ({ channelid, blocks }) =>
  channelid ? (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Info channelid={channelid} blocknumber={blocks} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <Blocks channelid={channelid} blocknumber={blocks} />
          <div id="realtime" />
        </div>

        <div className="row">
          <div className="col-md-12">
            <Transactions channelid={channelid} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to="/" />
  );

const MetricsWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ state: { channelid, blocks } }) => (
      <Metrics {...{ channelid, blocks }} {...props} />
    )}
  </Subscribe>
);

export default MetricsWithState;
