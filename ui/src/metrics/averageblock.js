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
import Octicon, { ArrowLeft, ArrowRight } from '@githubprimer/octicons-react';
import { timingSafeEqual } from 'crypto';
import * as d3 from "d3";
import { subscribeToBlocks } from '../SubscribeToBlocks.js';
import realTimeChartMulti from './realtimechart.js';

class AverageBlock extends Component {


    constructor(props) {

        super(props);
        this.channelid = this.props.match.params.channelid;
        this.blocknumber = this.props.match.params.blocknumber;
        this.blockview = this.blockview.bind(this);
        this.categories = [];
        let blocks = Number(this.blocknumber);
        this.range = blocks - 10;

        for (var i = this.range; i < blocks+10; i++) {

            this.categories.push(""+i);
        }
       

                    // create the real time chart
        this.chart = realTimeChartMulti()
            .width(900)               // width in pixels of chart; mandatory
            .height(350)              // height in pixels of chart; mandatory
            .yDomain(["1"])   // initial categories/data streams (note array),  mandatory
            .title("Blocks Per Minute")     // optional
            .yTitle("Blocks")     // optional
            .xTitle("Time")           // optional
            .border(true);            // optional



        let self = this;
        subscribeToBlocks(function (err, blocks) {
            self.numberofblocks = Number(blocks) - 1;
            localStorage.setItem("blocks", self.numberofblocks);
            self.setState({
                blocknumber: self.blocknumber
            });



             // create data item
           var obj = {
            time: new Date(), // mandatory
            category: blocks,      // mandatory
            type: "circle",               // optional (defaults to circle)
            color: "black",               // optional (defaults to black)
            opacity: 0.8,               // optional (defaults to 1)
            size: 5,                    // optional (defaults to 6)
            };
   
            self.chart.datum(obj);
      


        });

    }


    componentDidMount() {



        // invoke the chart
        var chartDiv = d3.select("#realtime").append("div")
            .attr("id", "chartDiv")
.       call(this.chart);

        // create data item
        var obj = {
        time: new Date(), // mandatory
        category: this.blocknumber,      // mandatory
        type: "circle",               // optional (defaults to circle)
        color: "black",               // optional (defaults to black)
        opacity: 0.8,               // optional (defaults to 1)
        size: 5,                    // optional (defaults to 6)
        };

        // send the data item to the chart
        this.chart.datum(obj);  

        // add Cata

        this.chart.yDomain(this.categories);

      /*  let self = this;
        setInterval(function() {

            // create data item
           var obj = {
            time: new Date(), // mandatory
            category: "1",      // mandatory
            type: "circle",               // optional (defaults to circle)
            color: "black",               // optional (defaults to black)
            opacity: 0.8,               // optional (defaults to 1)
            size: 5,                    // optional (defaults to 6)
            };
   
            self.chart.datum(obj);
      
          }, 1000)*/

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

                <div className="row">
                 
                    <div className="col-md-12">
                    
                        <div id="realtime"/>
                    
                    
                    </div>
                  
                </div>  
            </div>

        )

    }



}


export default AverageBlock

