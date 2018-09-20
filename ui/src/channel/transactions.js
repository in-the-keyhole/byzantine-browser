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
import ReactTable from "react-table";
import "react-table/react-table.css";
import { config } from "../Config.js";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.channelid = props.channelid;
    this.state = { block: "" };
    this.blocknumber = Number(props.blocknumber);
    this.writesets = [];
    this.readsets = [];
    this.endorsearray = null;
  }

  componentDidMount() {
    var self = this;
    axios({
      // using axios directly to avoid redirect interceptor
      method: "post",
      url: "/block",
      baseURL: config.apiserver,
      data: { channelid: self.channelid, blocknumber: this.blocknumber }
    })
      .then(function(res) {
        let json = JSON.parse(JSON.stringify(res.data));
        let writes = null;
        let reads = null;
        let txarray = json.data.data.map(t => {
          let lang =
            t.payload.data.actions[0].payload.chaincode_proposal_payload.input
              .chaincode_spec.typeString;
          //let proposalhash = t.payload.data.actions[0].proposal_response_payload.proposal_hash;
          let chaincode =
            t.payload.data.actions[0].payload.chaincode_proposal_payload.input
              .chaincode_spec.chaincode_id.name;
          let rwsets =
            t.payload.data.actions[0].payload.action.proposal_response_payload
              .extension.results.ns_rwset;
          let endorsements =
            t.payload.data.actions[0].payload.action.endorsements;

          let warray = rwsets.map(rw => {
            let writeset = {};
            writeset["namespace"] = rw.namespace;
            writes = rw.rwset.writes.map(s => {
              return s.key + " = " + s.value + "  ";
            });
            writeset["set"] = writes;
            return writeset;
          });

          let rarray = rwsets.map(rw => {
            let readset = {};
            readset["namespace"] = rw.namespace;
            reads = rw.rwset.reads.map(s => {
              return s.key + " = " + s.value + "  ";
            });
            readset["set"] = reads;
            return readset;
          });

          self.endorsearray = endorsements.map(e => {
            return e.endorser.Mspid;
          });

          self.writesets.push(warray);
          self.readsets.push(rarray);

          return {
            txid: t.payload.header.channel_header.tx_id,
            type: t.payload.header.channel_header.typeString,
            createdby: t.payload.header.signature_header.creator.Mspid,
            chaincode: chaincode + "(" + lang + ")",
            endorsements: self.endorsearray
          };
        });

        self.setState({ transactions: txarray });
      })
      .catch(function(err) {
        self.setState({ loginError: "Error Accessing Channel" });
      });
  }

  render() {
    let data = this.state.transactions;

    const columns = [
      {
        Header: "Tx Id",
        accessor: "txid" // String-based value accessors!
      },
      {
        Header: "Type",
        accessor: "type"
        //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
      {
        Header: "Created By",
        accessor: "createdby"
      },
      {
        Header: "Chaincode",
        accessor: "chaincode"
      },
      {
        Header: "Endorsements",
        accessor: "endorsements"
      }
    ];

    var ws = this.writesets;
    var rs = this.readsets;

    return (
      <div className="card">
        <div className="card-block">
          <h3 className="card-title">Transactions</h3>
        </div>
        <div className="col-md-12">
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            SubComponent={row => {
              return (
                <div>
                  <p>
                    <b> Reads </b>
                  </p>
                  {rs[row.index].map(r => {
                    return (
                      <div>
                        <p> Namespace: {r.namespace} </p>
                        <p> {r.set}</p>
                      </div>
                    );
                  })}
                  <p>
                    <b> Writes </b>
                  </p>
                  {ws[row.index].map(w => {
                    return (
                      <div>
                        <p> Namespace: {w.namespace} </p>
                        <p> {w.set}</p>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export default Transactions;
