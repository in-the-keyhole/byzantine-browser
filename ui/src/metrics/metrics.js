/*** 
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

import React, { Component } from 'react';
import axios from 'axios';
import * as d3 from "d3";
import { subscribeToBlocks } from '../SubscribeToBlocks.js';
import realTimeChartMulti from './realtimechart.js';
import Transactions from './transactions.js';
import Blocks from './blocks.js';
import Info from './info.js';


class Metrics extends Component {


    constructor(props) {

        super(props);

        this.channelid = localStorage.getItem("channelid");
        this.blocknumber = localStorage.getItem("blocks");


    }

    componentWillMount() {

        if (localStorage.getItem("channelid") == null) {
            window.location = ('/');
        }


    }


    render() {


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12"> <Info channelid={this.channelid} blocknumber={this.blocknumber} />  </div>
                </div>

                <div className="row">

                    <div className="col-md-12">

                        <Blocks channelid={this.channelid} blocknumber={this.blocknumber} />
                        <div id="realtime" />


                    </div>

                    <div className="row">

                        <div className="col-md-12">
                            <Transactions channelid={this.channelid} />
                        </div>
                    </div>



                </div>
            </div>

        )

    }



}


export default Metrics

