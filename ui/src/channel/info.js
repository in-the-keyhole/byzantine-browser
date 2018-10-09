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
import { subscribeToBlocks } from "../SubscribeToBlocks.js";
import { config } from "../Config.js";

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = { info: "", chaincodes: "" };

    subscribeToBlocks((err, blocks) => {
      this.setState({
        blocks: blocks
      })
    });
  }

  componentDidMount = async () => {
    const { channelid } = this.props;
    console.log("Accessing channels");
    try {
      const res = await axios({
        // using axios directly to avoid redirect interceptor
        method: "post",
        url: `/blockinfo?channelid=${channelid}`,
        baseURL: config.apiserver,
        data: { channelid }
      });
      const blockinfoJson = JSON.parse(JSON.stringify(res.data));

      let hash = "";
      const bytes = blockinfoJson.currentBlockHash.buffer.data;
      for (let index = 0; index < bytes.length; index += 1) {
        hash += String.fromCharCode(bytes[index]);
      }

      this.setState({
        blocks: blockinfoJson.height.low,
        currentBlockhash: hash
      });
    } catch (error) {
      this.setState({ loginError: "Error Accessing Channel" });
    }

    // Get Chaincode
    try {
      const result = await axios({
        // using axios directly to avoid redirect interceptor
        method: "post",
        url: `/chaincodes?channelid=${channelid}`,
        baseURL: config.apiserver,
        data: { channelid }
      });
      const chaincodeJson = JSON.parse(JSON.stringify(result.data));

      const cd = chaincodeJson.chaincodes;
      let list = "";
      for (let i = 0; i < cd.length; i++) {
        list += "name: " + cd[i].name + " version: " + cd[i].version + "\n";
      }

      this.setState({ chaincodes: list });
    } catch (error) {
      this.setState({ loginError: "Error Accessing Channel" });
    }
  };

  render() {
    const { channelid } = this.props;

    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Blockchain Info</h3>
        </div>
        <p>
          <b>Channel:</b> {channelid}
        </p>
        <p>
          <b># Blocks:</b> {this.state.blocks}
        </p>
        <p>
          <b>Chaincodes:</b>
        </p>
        {this.state.chaincodes}
      </div>
    );
  }
}

export default Info;
