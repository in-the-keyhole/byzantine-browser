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

class ChannelConfig extends Component {
  constructor(props) {
    super(props);
    this.channelid = props.channelid;
    this.state = { block: "" };
    let self = this;

    subscribeToBlocks(function (err, blocks) {
      const numberOfBlocks = Number(blocks) - 1;
      self.props.setNumberOfBlocks(numberOfBlocks);
      self.setState({ block: numberOfBlocks });

    });
  }

  componentDidUpdate = async prevProps => {
    if (this.props.blocknumber !== prevProps.blocknumber) {
      await this.getConfigData();
    }
  };

  componentDidMount = async () => {
    await this.getConfigData();
  };


  async getConfigData() {
    const { channelid, numberofblocks } = this.props;

    try {
      const res = await axios({
        // using axios directly to avoid redirect interceptor
        method: "post",
        url: "/channelconfig",
        baseURL: config.apiserver,
        data: { channelid, blocknumber: numberofblocks }
      });
      let json = JSON.parse(JSON.stringify(res.data));

      let block = parseInt(json.header.number) + 1;
      let ordaddr = json.data.data[0].payload.data.config.channel_group.values.OrdererAddresses.value.addresses;
      let hashingalgo = json.data.data[0].payload.data.config.channel_group.values.HashingAlgorithm.value.name;
      let consortium = json.data.data[0].payload.data.config.channel_group.values.Consortium.value.name;
      let batchsize = json.data.data[0].payload.data.config.channel_group.groups.Orderer.values.BatchSize.value.max_message_count;
      let batchtimeout = json.data.data[0].payload.data.config.channel_group.groups.Orderer.values.BatchTimeout.value.timeout;
      let consensustype = json.data.data[0].payload.data.config.channel_group.groups.Orderer.values.ConsensusType.value.type;
      let lastupdate = json.data.data[0].payload.header.channel_header.timestamp;
      let app = json.data.data[0].payload.data.config.channel_group.groups.Application.groups;
      let pol = json.data.data[0].payload.data.config.channel_group.policies;
      let orgs = [];
      for (var p in app) {
        let org = {};
        org.name = p;
        orgs.push(org);
      }

      let policies = [];
      for (var poly in pol) {
        pol[poly].name = poly;
        policies.push(pol[poly]);
      }


      this.setState({ block: block, policies: policies, consortium: consortium, orgs: orgs, lastupdate: lastupdate, orderers: ordaddr, hashingalgorithm: hashingalgo, batchsize: batchsize, consensustype: consensustype, batchtimeout: batchtimeout });


    } catch (error) {
      this.setState({ loginError: "Error Accessing CONFIG Block" });
    }
  }


  blockClick = e => {
    e.preventDefault();
    this.props.history.push(`/channel/${(this.state.block - 1)}`);
  };



  render() {
    const { blocknumber, numberofblocks } = this.props;

    let orgs = [];

    if (this.state.orgs) {
      this.state.orgs.forEach((o) => {
        orgs.push(<div key={o.name}><b>Org:</b> {o.name}</div>);
      }
      );
    }


    let policies = [];

    if (this.state.policies) {

      this.state.policies.forEach((p) => {
        policies.push(<div key={p.name}><b> {p.name}  Policy</b>: {p.policy.type}, {p.policy.value.rule} </div>);
      }
      );

    }




    return (

      <div className="container">

        <div className="row bg-info">
          <div className="col-md-12"> <h3><b>Current Configuration as of:</b> {this.state.lastupdate}</h3> </div>
        </div>

        <div className="row">
          <div className="col-md-10"> <h3><b>Consortium:</b> {this.state.consortium}</h3> </div>
          <div className="col-md-2"> <h3><b>Block:</b> <a onClick={this.blockClick}>{this.state.block}</a> </h3></div>
        </div>

        <div className="row">


          <div className="col-md-4">

            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Organizations</h4>
              </div>
              <div className="col-md-12">
                {orgs}
              </div>
            </div>
          </div>


          <div className="col-md-4">

            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Orderer</h4>
              </div>
              <div className="col-md-12">
                <div><b>Orderers:</b> {this.state.orderers}</div>
                <div><b>Consensus Type:</b> {this.state.consensustype}</div>
                <div><b>Batch Size:</b> {this.state.batchsize}</div>
                <div><b>Batch Timeout:</b> {this.state.batchtimeout}</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">

            <div className="card">
              <div className="card-block">
                <h4 className="card-title">Channel</h4>
              </div>
              <div className="col-md-12">

                <div>
                  <b>Hashing Algorithm:</b> {this.state.hashingalgorithm}
                </div>
                <div>
                  <b>Batch Size:</b> {this.state.batchsize}
                </div>
                   {policies}
              </div>
            </div>
          </div>

        </div>
      </div>

    );
  }
}

const ConfigWithState = props => (
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
        <ChannelConfig
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

export default withRouter(ConfigWithState);
