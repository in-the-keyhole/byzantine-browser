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

import jsonFormatter from "json-format";

class RawBlock extends Component {
  constructor(props) {
    super(props);
    this.channelid = this.props.match.params.channelid;
    this.blocknumber = Number(this.props.match.params.blocknumber) + 1;
    this.block = jsonFormatter(
      JSON.parse(localStorage.getItem("currentblock"))
    );
    this.blocks = Number(localStorage.getItem("blocks")) + 1;
  }

  componentDidMount() {
    console.log(this.block);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h4>
              <b>Block:</b> {this.blocknumber} <b> of </b> {this.blocks}{" "}
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <textarea rows="30" cols="120" value={this.block} />
          </div>
        </div>
      </div>
    );
  }
}

export default RawBlock;
