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
  constructor(props) {
    super(props);
    this.channelid = props.channelid;
    this.state = { peers: [] };
  }

  componentDidMount() {
    console.log("Accessing channels");
    var self = this;
    axios({
      // using axios directly to avoid redirect interceptor
      method: "post",
      url: "/peers",
      baseURL: config.apiserver,
      data: { channelid: self.channelid }
    })
      .then(function(res) {
        var a = [];
        a.push(res.data);
        self.setState({ peers: a });
      })
      .catch(function(err) {
        self.setState({ loginError: "Error Accessing Channel" });
      });
  }

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
