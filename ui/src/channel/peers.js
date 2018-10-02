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
import { config } from "../Config.js";

class Peers extends Component {
  state = { peers: [] };

  componentDidMount = async () => {
    const { channelid } = this.props;
    console.log("Accessing peers");
    try {
      const res = await axios({
        // using axios directly to avoid redirect interceptor
        method: "post",
        url: "/peers",
        baseURL: config.apiserver,
        data: { channelid }
      });
      const a = [];
      a.push(res.data);
      this.setState({ peers: a });
    } catch (error) {
      this.setState({ loginError: "Error Accessing Peers" });
    }
  };

  render() {
    const listItems = this.state.peers.map((number, i) => (
      <li key={i}> {number} </li>
    ));

    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Peers</h3>
        </div>
        <ul className="list-group list-group-flush">{listItems}</ul>
      </div>
    );
  }
}

export default Peers;
