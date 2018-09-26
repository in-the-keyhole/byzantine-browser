/*
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
import Peers from "./peers.js";
import Info from "./info.js";
import Block from "./block.js";
import Transactions from "./transactions.js";
import { Subscribe } from "unstated";
import ChannelContainer from "../ChannelContainer.js";
import { Redirect } from "react-router";

const Channel = ({
  channelid,
  match: {
    params: { blocknumber }
  }
}) =>
  channelid ? (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <Block channelid={channelid} blocknumber={+blocknumber} />
        </div>
        <div className="col-md-3">
          <Info channelid={channelid} />
        </div>
        <div className="col-md-3">
          <Peers channelid={channelid} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Transactions channelid={channelid} blocknumber={+blocknumber} />
        </div>
      </div>
    </div>
  ) : (
    <Redirect to="/select" />
  );

const ChannelWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ state: { channelid } }) => <Channel {...{ channelid }} {...props} />}
  </Subscribe>
);

export default ChannelWithState;
