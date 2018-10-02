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

import React from "react";
import jsonFormatter from "json-format";
import { Subscribe } from "unstated";
import ChannelContainer from "../ChannelContainer";

const RawBlock = ({
  match: {
    params: { blocknumber }
  },
  blocks,
  currentBlockData
}) =>
  currentBlockData ? (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h4>
            <b>Block:</b> {+blocknumber + 1} <b> of </b> {+blocks + 1}
          </h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <textarea
            rows="30"
            cols="120"
            value={jsonFormatter(currentBlockData)}
          />
        </div>
      </div>
    </div>
  ) : (
    <p>No block data available.</p>
  );

const BlockWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ state: { currentBlockData, blocks } }) => (
      <RawBlock
        {...{
          currentBlockData,
          blocks
        }}
        {...props}
      />
    )}
  </Subscribe>
);

export default BlockWithState;
