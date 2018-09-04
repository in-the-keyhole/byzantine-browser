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
import realTimeChartMulti from './realtimechart.js';
import { config } from '../Config.js';
import * as d3 from "d3";
import {subscribeToBlocks} from '../SubscribeToBlocks.js';

class Info extends Component {


    constructor(props) {

        super(props);
        this.channelid = this.props.channelid;
        this.blocknumber = this.props.blocknumber;
        let blocks = Number(this.blocknumber);

        this.state = {height: blocks, date: ''};

        subscribeToBlocks((err, blocks) => this.setState({ 
            height: blocks 
          }));

       
    }


    componentDidMount() {


        let self = this;
       
        setInterval(function () {


            axios({// using axios directly to avoid redirect interceptor
                method:'post',
                url:'/block',
                baseURL: config.apiserver,
                data: {channelid: self.channelid, blocknumber: 0}
            }).then(function (res) {

                var json = JSON.parse(JSON.stringify(res.data));

                self.setState({ date: json.data.data[0].payload.header.channel_header.timestamp }  );

            }).catch(function (err) {
                console.log(err);
                self.setState({ loginError: 'Error acccesing api' });
            });




            let start = new Date().getTime();
            axios({// using axios directly to avoid redirect interceptor
                method: 'post',
                url: '/blockinfo?channelid=' + self.channelid,
                baseURL: config.apiserver,
                data: { channelid: self.channelid }
            }).then(function (res) {

                var json = JSON.parse(JSON.stringify(res.data));
                let blocks = json.height.low;

                self.setState({height: blocks }  );


            }).catch(function (err) {
                console.log(err);
                self.setState({ loginError: 'Error acccesing api' });
            });


        }, 1000);


    }


    render() {

        return (
            <h4><b>Height:</b> {this.state.height}     <b>Created:</b> {this.state.date} </h4>    

        )

    }



}


export default Info

