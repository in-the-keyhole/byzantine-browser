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
import { Subscribe } from "unstated";
import ChannelContainer from "./ChannelContainer.js";
import { Redirect } from "react-router";
import ChannelInputHandler from "./ChannelInputHandler.js";

class SelectChannel extends Component {
  render() {
    const { channelid, setChannelInfo, error } = this.props;

    return channelid ? (
      <Redirect to="/channel" />
    ) : (
      <div className="jumbotron">
        <h1 className="display-3">Hyperledger Browser</h1>
        <p className="lead">Browse Blocks and Transaction Data</p>
        <hr className="my-4" />
        <p>Input Channel name to Browse</p>
        <ChannelInputHandler {...{ setChannelInfo }}>
          {({ handleSubmit, handleInputChange }) => (
            <form className="form" onSubmit={handleSubmit}>
              <p>
                <input
                  type="text"
                  className="form-control"
                  name="channelid"
                  placeholder="Channel Id, enter `mychannel` to browser a test network..."
                  onChange={handleInputChange}
                />
              </p>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <p className="lead">
                <button type="submit" className="btn btn-primary btn-lg">
                  Browse
                </button>
              </p>
            </form>
          )}
        </ChannelInputHandler>
      </div>
    );
  }
}

const SelectChannelWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ setChannelInfo, state: { channelid, error } }) => (
      <SelectChannel {...{ setChannelInfo, channelid, error }} {...props} />
    )}
  </Subscribe>
);

export default SelectChannelWithState;
