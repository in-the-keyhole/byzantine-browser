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

import React, { Component } from "react";
import axios from "axios";
import realTimeChartMulti from "./realtimechart.js";
import { config } from "../Config.js";
import * as d3 from "d3";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      floor: 0,
      ceiling: 40
    };

    // create the real time chart
    this.chart = realTimeChartMulti()
      .width(900) // width in pixels of chart; mandatory
      .height(350) // height in pixels of chart; mandatory
      .yDomain(["1"]) // initial categories/data streams (note array),  mandatory
      .title("Tx's Proposal Rate (ms)") // optional
      .yTitle("Ms") // optional
      .xTitle("Time") // optional
      .border(true); // optional

    this.chart.yDomain(this.generateY(this.state.floor, this.state.ceiling));
  }

  generateY = (floor, ceiling) => {
    let cats = [];
    for (let i = floor; i < ceiling; i++) {
      cats.push(i);
    }

    return cats;
  };

  componentWillUnmount() {
    // TODO - need to figure out how to tell the chart
    // to cancel subscriptions after component is unmounted
    clearTimeout(this.interval);
  }

  componentDidMount = async () => {
    const { channelid, blocknumber } = this.props;
    this.createChart(blocknumber);

    // get Chaincodes, first one will be used to send proposal
    try {
      const res = await axios({
        method: "post",
        url: `/chaincodes?channelid=${channelid}`,
        baseURL: config.apiserver,
        data: { channelid }
      });
      let json = JSON.parse(JSON.stringify(res.data));
      let cd = json.chaincodes;
      let cdname = cd[0].name;
      let over = 0;

      this.interval = setInterval(async () => {
        let start = new Date().getTime();
        try {
          await axios({
            // using axios directly to avoid redirect interceptor
            method: "post",
            url: "/txproposalrate",
            baseURL: config.apiserver,
            data: { channelid, chaincode: cdname }
          });
          let ms = new Date().getTime() - start;
          // create data item
          var obj = {
            time: new Date(), // mandatory
            category: ms, // mandatory
            type: "circle", // optional (defaults to circle)
            color: "red", // optional (defaults to black)
            opacity: 0.8, // optional (defaults to 1)
            size: 5 // optional (defaults to 6)
          };

          this.chart.datum(obj);

          if (ms >= this.state.ceiling || ms <= this.state.floor) {
            over = over + 1;
            const ceiling = ms + 10;
            const floor = ms - 10;
            this.chart.yDomain(this.generateY(floor, ceiling));
            this.setState(() => ({ ceiling, floor }));
          }
        } catch (error) {
          console.log(error);
          this.setState({ loginError: "Error acccesing api" });
        }
      }, 1000);
    } catch (error) {
      this.setState({ loginError: "Error Accessing Channel" });
    }
  };

  createChart = blocknumber => {
    // invoke the chart
    d3.select("#tx")
      .append("div")
      .attr("id", "tx")
      .call(this.chart);

    // create data item
    var obj = {
      time: new Date(), // mandatory
      category: blocknumber, // mandatory
      type: "line", // optional (defaults to circle)
      color: "black", // optional (defaults to black)
      opacity: 0.8, // optional (defaults to 1)
      size: 5 // optional (defaults to 6)
    };

    // send the data item to the chart
    this.chart.datum(obj);
  };

  render() {
    return <div id="tx" />;
  }
}

export default Transactions;
