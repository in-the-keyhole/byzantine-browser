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
import { subscribeToBlocks } from "../SubscribeToBlocks.js";
import { config } from "../Config.js";
import { Subscribe } from "unstated";
import ChannelContainer from "../ChannelContainer.js";
import { withRouter } from "react-router";

class Block extends Component {
  constructor(props) {
    super(props);
    this.channelid = props.channelid;
    this.state = { block: "" };
    let self = this;

    subscribeToBlocks(function(err, blocks) {
      const numberOfBlocks = Number(blocks) - 1;
      self.props.setNumberOfBlocks(numberOfBlocks);
      self.setState({block: numberOfBlocks });
     
    });
  }

  updateData = async () => {
    const { channelid, blocknumber, setCurrentBlockData } = this.props;

    try {
      const res = await axios({
        // using axios directly to avoid redirect interceptor
        method: "post",
        url: "/block",
        baseURL: config.apiserver,
        data: { channelid, blocknumber }
      });
      const json = JSON.parse(JSON.stringify(res.data));
      await setCurrentBlockData(json);

      try {
        const results = await axios({
          // using axios directly to avoid redirect interceptor
          method: "post",
          url: "/blockhash",
          baseURL: config.apiserver,
          data: {
            number: json.header.number,
            prevhash: json.header.previous_hash,
            datahash: json.header.data_hash
          }
        });

        let timestamp =
          json.data.data[0].payload.header.channel_header.timestamp;
        let typestring =
          json.data.data[0].payload.header.channel_header.typeString;

        this.setState({
          number: json.header.number,
          hash: results.data,
          previousHash: json.header.previous_hash,
          txno: json.data.data.length,
          timestamp: timestamp,
          type: typestring
        });
      } catch (error) {
        console.error(error);
        this.setState({ loginError: "Error accessing block hash" });
      }
    } catch (error) {
      console.error(error);
      this.setState({ loginError: "Error acccesing block" });
    }
  };

  componentDidUpdate = async prevProps => {
    if (this.props.blocknumber !== prevProps.blocknumber) {
      await this.updateData();
    }
  };

  componentDidMount = async () => {
    await this.updateData();
  };

  prevClick = e => {
    e.preventDefault();
    this.props.history.push(`/channel/${this.props.blocknumber - 1}`);
  };

  nextClick = e => {
    e.preventDefault();
    this.props.history.push(`/channel/${this.props.blocknumber + 1}`);
  };

  rawClick = e => {
    e.preventDefault();
    this.props.history.push(
      `/rawblock/${this.props.channelid}/${this.props.blocknumber}`
    );
  };

  genesisClick = e => {
    e.preventDefault();
    this.props.history.push("/channel/0");
  };

  latestClick = e => {
    e.preventDefault();
    this.props.history.push(`/channel/${this.props.numberofblocks}`);
  };

  render() {
    const { blocknumber, numberofblocks } = this.props;
    const number = (blocknumber || 0) + 1 + "/" + (numberofblocks + 1);

    let pre = <span> &nbsp; </span>;
    if (blocknumber > 0) {
      pre = (
        <span onClick={this.prevClick}>
          <Octicon icon={ArrowLeft} />
        </span>
      );
    }

    let next = <span> </span>;
    if (blocknumber < numberofblocks) {
      next = (
        <span onClick={this.nextClick}>
          <Octicon icon={ArrowRight} />
        </span>
      );
    }

    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Block</h3>
        </div>
        <p>
          <a onClick={this.rawClick}>Raw</a> |
          <a onClick={this.genesisClick}> Genesis</a> |
          <a onClick={this.latestClick}> Latest</a> 
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

const BlockWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({
      setNumberOfBlocks,
      setCurrentBlockNumber,
      setCurrentBlockData,
      state: {
        channelid,
        currentblocknumber: blocknumber,
        blocks: numberofblocks
      }
    }) => (
      <Block
        {...{
          channelid,
          blocknumber,
          numberofblocks,
          setNumberOfBlocks,
          setCurrentBlockNumber,
          setCurrentBlockData
        }}
        {...props}
      />
    )}
  </Subscribe>
);

export default withRouter(BlockWithState);
