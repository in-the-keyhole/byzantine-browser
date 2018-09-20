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
    this.channelid = props.channelid;
    this.state = { info: "", chaincodes: "" };

    subscribeToBlocks((err, blocks) =>
      this.setState({
        blocks: blocks
      })
    );
  }

  componentDidMount() {
    console.log("Accessing channels");
    var self = this;
    axios({
      // using axios directly to avoid redirect interceptor
      method: "post",
      url: "/blockinfo?channelid=" + self.channelid,
      baseURL: config.apiserver,
      data: { channelid: self.channelid }
    })
      .then(function(res) {
        // alert (JSON.stringify(res.data));
        var json = JSON.parse(JSON.stringify(res.data));

        var hash = "";
        var bytes = json.currentBlockHash.buffer.data;
        var count = bytes.length;
        for (var index = 0; index < bytes.length; index += 1) {
          hash += String.fromCharCode(bytes[index]);
        }

        self.setState({ blocks: json.height.low, currentBlockhash: hash });
      })
      .catch(function(err) {
        self.setState({ loginError: "Error Accessing Channel" });
      });

    // Get Chaincode

    var self = this;
    axios({
      // using axios directly to avoid redirect interceptor
      method: "post",
      url: "/chaincodes?channelid=" + self.channelid,
      baseURL: config.apiserver,
      data: { channelid: self.channelid }
    })
      .then(function(res) {
        // alert (JSON.stringify(res.data));
        var json = JSON.parse(JSON.stringify(res.data));

        var cd = json.chaincodes;
        var list = "";
        for (var i = 0; i < cd.length; i++) {
          list += "name: " + cd[i].name + " version: " + cd[i].version + "\n";
        }
        var hash = "";
        // var bytes = json.currentBlockHash.buffer.data;
        // var count = bytes.length;
        // for(var index = 0; index < bytes.length; index += 1) {
        //  hash += String.fromCharCode(bytes[index]);
        //}

        self.setState({ chaincodes: list });
      })
      .catch(function(err) {
        self.setState({ loginError: "Error Accessing Channel" });
      });
  }

  render() {
    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Blockchain Info</h3>
        </div>
        <p>
          <b>Channel:</b> {this.channelid}
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
