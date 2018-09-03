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

class Transactions extends Component {


    constructor(props) {

        super(props);
        this.channelid = props.channelid;
        this.floor = 0;
        this.ceiling = 40;

        // create the real time chart
        this.chart = realTimeChartMulti()
            .width(900)               // width in pixels of chart; mandatory
            .height(350)              // height in pixels of chart; mandatory
            .yDomain(["1"])   // initial categories/data streams (note array),  mandatory
            .title("Tx's Proposal Rate (ms)")     // optional
            .yTitle("Ms")     // optional
            .xTitle("Time")           // optional
            .border(true);            // optional

    }

    componentDidMount() {


        this.createChart();

        // get Chaincodes, first one will be used to send proposal
        var self = this;
        axios({
            method: 'post',
            url: '/chaincodes?channelid=' + self.channelid,
            baseURL: config.apiserver,
            data: { channelid: self.channelid }
        }).then(function (res) {

            var json = JSON.parse(JSON.stringify(res.data));
            var cd = json.chaincodes;
            var cdname = cd[0].name;
            var over = 0;
            
            /* var list = '';
             for (var i = 0; i < cd.length; i++) {
 
                 list += "name: "+cd[i].name + " version: "+cd[i].version + "\n";
 
             } */

            setInterval(function () {

                let start = new Date().getTime();
                axios({// using axios directly to avoid redirect interceptor
                    method: 'post',
                    url: '/txproposalrate',
                    baseURL: config.apiserver,
                    data: { channelid: self.channelid, chaincode: cdname }
                }).then(function (res) {

                    let ms = new Date().getTime() - start;
                    // create data item
                    var obj = {
                        time: new Date(), // mandatory
                        category: ms,      // mandatory
                        type: "circle",               // optional (defaults to circle)
                        color: "red",               // optional (defaults to black)
                        opacity: 0.8,               // optional (defaults to 1)
                        size: 5,                    // optional (defaults to 6)
                    };

                    self.chart.datum(obj);
                    var json = JSON.parse(JSON.stringify(res.data))
                  
                    if (ms >= self.ceiling) {                  
                        over++;
                    }

                    if (over > 4) {
                       self.ceiling = self.ceiling + (self.ceiling / 2); 
                       self.floor = self.floor + (self.ceiling /2);   
                       over = 0;
                       
                       self.generateY();
                       

                    }



                }).catch(function (err) {
                    console.log(err);
                    self.setState({ loginError: 'Error acccesing api' });
                });
            }, 1000);


        }).catch(function (err) {
            self.setState({ loginError: 'Error Accessing Channel' });
        });



    }


    createChart() {


        // invoke the chart
        var chartDiv = d3.select("#tx").append("div")
            .attr("id", "tx")
            .call(this.chart);

        // create data item
        var obj = {
            time: new Date(), // mandatory
            category: this.blocknumber,      // mandatory
            type: "line",               // optional (defaults to circle)
            color: "black",               // optional (defaults to black)
            opacity: 0.8,               // optional (defaults to 1)
            size: 5,                    // optional (defaults to 6)
        };

        // send the data item to the chart
        this.chart.datum(obj);

        this.generateY();
        

    }


    generateY() {

        let cats = [];
        for (var i = this.floor; i < this.ceiling; i++) {
            cats.push(i);
        }

        this.chart.yDomain(cats);

    }


    render() {

        return (

            <div id="tx" />


        )

    }



}


export default Transactions

