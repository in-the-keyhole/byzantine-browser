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


class Metrics extends Component {


    constructor(props) {

        super(props);
        this.channelid = this.props.match.params.channelid;
        this.blocknumber = this.props.match.params.blocknumber;
        this.blockview = this.blockview.bind(this);

    }




    blockview(e) {

        e.preventDefault();
        window.location = ('/channel/' + this.channelid + '/' + this.blocknumber);

    }



    render() {


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12"> <button type="button" onClick={this.blockview} class="btn btn-primary btn-sm pull-right">Block View</button>   </div>
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

