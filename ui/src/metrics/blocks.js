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

class Blocks extends Component {


    constructor(props) {

        super(props);
        this.channelid = this.props.channelid;
        this.blocknumber = this.props.blocknumber;
        this.categories = [];
        let blocks = Number(this.blocknumber);
        this.range = blocks - 10;
        this.floor = blocks - 10;
        this.ceiling = blocks + 10;

        // create the real time chart
        this.chart = realTimeChartMulti()
            .width(900)               // width in pixels of chart; mandatory
            .height(350)              // height in pixels of chart; mandatory
            .yDomain(["1"])   // initial categories/data streams (note array),  mandatory
            .title("Blocks Per Minute")     // optional
            .yTitle("Blocks")     // optional
            .xTitle("Time")           // optional
            .border(true);            // optional


        this.calculateY();

    }


    calculateY() {

        this.categories = [];

        for (var i = this.floor; i < this.ceiling; i++) {
            this.categories.push(i);
        }

        this.chart.yDomain(this.categories);


    }



    componentDidMount() {


        let self = this;
        // invoke the chart
        var chartDiv = d3.select("#blocks").append("div")
            .attr("id", "blocks")
            .call(this.chart);

        setInterval(function () {

            let start = new Date().getTime();
            axios({// using axios directly to avoid redirect interceptor
                method: 'post',
                url: '/blockinfo?channelid=' + self.channelid,
                baseURL: config.apiserver,
                data: { channelid: self.channelid }
            }).then(function (res) {

                var json = JSON.parse(JSON.stringify(res.data));
                let blocks = json.height.low;

                // create data item
                var obj = {
                    time: new Date(), // mandatory
                    category: json.height.low,      // mandatory
                    type: "circle",               // optional (defaults to circle)
                    color: "black",               // optional (defaults to black)
                    opacity: 0.8,               // optional (defaults to 1)
                    size: 5,                    // optional (defaults to 6)
                };


                if (blocks >= self.ceiling) {
                    self.floor = blocks - 10;
                    self.ceiling = blocks + 10;
                    self.calculateY();
                    self.chart.yDomain(self.categories);

                }


                // send the data item to the chart
                self.chart.datum(obj);



            }).catch(function (err) {
                console.log(err);
                self.setState({ loginError: 'Error acccesing api' });
            });


        }, 1000);


    }




    render() {

        return (

            <div id="blocks" />


        )

    }



}


export default Blocks

