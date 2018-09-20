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

import React, { Component } from "react";
import Channel from "./channel/channel.js";
import SelectChannel from "./SelectChannel.js";
import { Subscribe } from "unstated";
import ChannelContainer from "./ChannelContainer.js";
import { Redirect } from "react-router";

class Home extends Component {
  state = { error: "" };

  render() {
    const { channelid } = this.props;
    const blocks = <Channel />;
    const selectChannel = <SelectChannel />;

    return channelid ? <Redirect to="/channel" /> : selectChannel;
  }
}

const HomeWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ state: { channelid } }) => <Home {...{ channelid }} {...props} />}
  </Subscribe>
);

export default HomeWithState;
