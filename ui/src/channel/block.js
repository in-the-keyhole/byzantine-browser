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
import Octicon, { ArrowLeft, ArrowRight } from "@githubprimer/octicons-react";
import { timingSafeEqual } from "crypto";
import { subscribeToBlocks } from "../SubscribeToBlocks.js";
import { config } from "../Config.js";

class Block extends Component {
  constructor(props) {
    super(props);
    this.channelid = props.channelid;
    this.state = { block: "" };
    this.blocknumber = Number(props.blocknumber);
    this.prevClick = this.prevClick.bind(this);
    this.nextClick = this.nextClick.bind(this);
    this.rawClick = this.rawClick.bind(this);
    this.genesisClick = this.genesisClick.bind(this);
    this.latestClick = this.latestClick.bind(this);
    this.numberofblocks = Number(localStorage.getItem("blocks"));

    let self = this;
    subscribeToBlocks(function(err, blocks) {
      self.numberofblocks = Number(blocks) - 1;
      localStorage.setItem("blocks", self.numberofblocks);
      self.setState({
        blocknumber: self.blocknumber
      });
    });
  }

  componentDidMount() {
    var self = this;
    axios({
      // using axios directly to avoid redirect interceptor
      method: "post",
      url: "/block",
      baseURL: config.apiserver,
      data: { channelid: self.channelid, blocknumber: self.blocknumber }
    })
      .then(function(res) {
        var json = JSON.parse(JSON.stringify(res.data));

        axios({
          // using axios directly to avoid redirect interceptor
          method: "post",
          url: "/blockhash",
          baseURL: config.apiserver,
          data: {
            number: json.header.number,
            prevhash: json.header.previous_hash,
            datahash: json.header.data_hash
          }
        })
          .then(function(results) {
            localStorage.setItem("currentblock", JSON.stringify(json));

            let timestamp =
              json.data.data[0].payload.header.channel_header.timestamp;
            let typestring =
              json.data.data[0].payload.header.channel_header.typeString;

            self.setState({
              number: json.header.number,
              hash: results.data,
              previousHash: json.header.previous_hash,
              txno: json.data.data.length,
              timestamp: timestamp,
              type: typestring
            });
          })
          .catch(function(err) {
            console.log(err);
            self.setState({ loginError: "Error accessing block hahs" });
          });
      })
      .catch(function(err) {
        console.log(err);
        self.setState({ loginError: "Error acccesing block" });
      });
  }

  prevClick(e) {
    e.preventDefault();
    localStorage.setItem("currentblocknumber", this.blocknumber - 1);
    window.location = "/channel";
  }

  nextClick(e) {
    e.preventDefault();
    localStorage.setItem("currentblocknumber", this.blocknumber + 1);
    window.location = "/channel";
  }

  rawClick(e) {
    e.preventDefault();
    window.location = "/rawblock/" + this.channelid + "/" + this.blocknumber;
  }

  genesisClick(e) {
    e.preventDefault();
    localStorage.setItem("currentblocknumber", 0);
    window.location = "/channel";
  }

  latestClick(e) {
    e.preventDefault();
    localStorage.setItem("currentblocknumber", this.numberofblocks);
    window.location = "/channel";
  }

  render() {
    let number = this.blocknumber + 1 + "/" + (this.numberofblocks + 1);

    var pre = <span> &nbsp; </span>;
    if (this.blocknumber > 0) {
      pre = (
        <a onClick={this.prevClick}>
          <Octicon icon={ArrowLeft} />
        </a>
      );
    }

    var next = <span> </span>;
    if (this.blocknumber < this.numberofblocks) {
      next = (
        <a onClick={this.nextClick}>
          <Octicon icon={ArrowRight} />
        </a>
      );
    }

    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Block</h3>
        </div>
        <p>
          <a onClick={this.rawClick}>Raw</a> |
          <a onClick={this.genesisClick}>Genesis</a> |
          <a onClick={this.latestClick}>Latest</a>
        </p>
        <p>
          <b>Number:</b> {pre} {number} {next}
        </p>
        <p>
          <b>Type:</b> {this.state.type}
        </p>
        <p>
          <b>Block Hash:</b> {this.state.hash}
        </p>
        <p>
          <b>Previous Hash:</b> {this.state.previousHash}
        </p>
        <p>
          <b>Timestamp:</b> {this.state.timestamp}
        </p>
        <p>
          <b>Transactions :</b> {this.state.txno}
        </p>
      </div>
    );
  }
}

export default Block;
