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

import React, { Component } from 'react';
import axios from 'axios';
import Octicon, { ArrowLeft, ArrowRight } from '@githubprimer/octicons-react';
import { timingSafeEqual } from 'crypto';
import { subscribeToBlocks } from '../SubscribeToBlocks.js';

class BlocksPerMinute extends Component {


    constructor(props) {

        super(props);
        this.channelid = this.props.channelid;
        this.blocknumber = this.props.blocknumber;
        this.blockview = this.blockview.bind(this);
       

        let self = this;
        subscribeToBlocks(function (err, blocks) {
            self.numberofblocks = Number(blocks) - 1;
            localStorage.setItem("blocks", self.numberofblocks);
            self.setState({
                blocknumber: self.blocknumber
            });
        });

    }


    blockview(e) {

        e.preventDefault();

    
        window.location = ('/channel/' + this.channelid + '/' + this.blocknumber );


    }



    render() {


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12"> <button type="button" onClick={this.blockview} class="btn btn-primary btn-sm pull-right">Block View</button>   </div>
                </div>

                Hello World

            </div>

        )

    }



}


export default BlocksPerMinute

