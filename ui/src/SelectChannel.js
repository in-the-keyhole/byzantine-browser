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
import axios from "axios";
import { config } from "./Config.js";
import { Container, Subscribe } from "unstated";
import ChannelContainer from "./ChannelContainer.js";
import { withRouter } from "react-router-dom";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";
class SelectChannel extends Component {
  constructor(props) {
    super(props);
    this.state = { channelid: "", error: "" };
  }

  handleInputChange = ev => {
    const target = ev.target;
    this.setState({ [target.name]: target.value, error: "" });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const { resetChannelId, setChannelInfo, history } = this.props;
    // remove old before fetchin a new one
    // localStorage.removeItem("channelid");
    resetChannelId();

    var self = this;
    axios({
      // using axios directly to avoid redirect interceptor
      method: "post",
      url: "/blockinfo",
      baseURL: config.apiserver,
      data: self.state
    })
      .then(function(res) {
        console.log(res.data);

        if (res.data && res.data !== "") {
          //   localStorage.setItem("blocks", res.data.height.low - 1);
          //   localStorage.setItem("currentblocknumber", res.data.height.low - 1);
          //   localStorage.setItem("channelid", self.state.channelid);

          setChannelInfo({
            blocks: res.data.height.low - 1,
            currentblocknumber: res.data.height.low - 1,
            channelid: self.state.channelid
          });
          history.push("/channel");
        } else {
          self.setState({ error: "Channel not found..." });
          //   localStorage.removeItem("channelid");
          resetChannelId();
        }
      })
      .catch(function(err) {
        console.log("ERROR " + err);
      });
  };

  render() {
    console.log(this.props);
    const { error } = this.state;

    return (
      <div className="jumbotron">
        <h1 className="display-3">Hyperledger Browser</h1>
        <p className="lead">Browse Blocks and Transaction Data</p>
        <hr className="my-4" />
        <p>Input Channel name to Browse</p>
        <form className="form" onSubmit={this.handleSubmit}>
          <p>
            <input
              type="text"
              className="form-control"
              name="channelid"
              placeholder="Channel Id"
              onChange={this.handleInputChange}
            />
          </p>
          {error && (
            <div className="alert alert-danger" role="alert">
              Channel not found...
            </div>
          )}
          <p className="lead">
            <button type="submit" className="btn btn-primary btn-lg">
              Browse
            </button>
          </p>
        </form>
      </div>
    );
  }
}

const SelectChannelWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ setChannelInfo, resetChannelId }) => (
      <SelectChannel {...{ setChannelInfo, resetChannelId }} {...props} />
    )}
  </Subscribe>
);

export default SelectChannelWithState;
