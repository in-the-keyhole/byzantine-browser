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

class Blocks extends Component {
  constructor(props) {
    super(props);
    let blocks = Number(props.blocknumber);


    // create the real time chart
    this.chart = realTimeChartMulti()
      .width(900) // width in pixels of chart; mandatory
      .height(350) // height in pixels of chart; mandatory
      .yDomain(["1"]) // initial categories/data streams (note array),  mandatory
      .title("Blocks Per Minute") // optional
      .yTitle("Blocks") // optional
      .xTitle("Time") // optional
      .border(true); // optional

    this.chart.yDomain(this.calculateY(blocks - 10, blocks + 10));
  }

  calculateY = (floor, ceiling) => {
    let categories = [];

    for (var i = floor; i < ceiling; i++) {
      categories.push(i);
    }

    return categories;
  };

  componentDidMount() {
    const { channelid, blocknumber } = this.props;
    const ceiling = Number(blocknumber) + 10;
    // invoke the chart
    d3.select("#blocks")
      .append("div")
      .attr("id", "blocks")
      .call(this.chart);

    this.interval = setInterval(async () => {
      try {
        const res = await axios({
          // using axios directly to avoid redirect interceptor
          method: "post",
          url: `/blockinfo?channelid=${channelid}`,
          baseURL: config.apiserver,
          data: { channelid }
        });
        const json = JSON.parse(JSON.stringify(res.data));
        let blocks = json.height.low;

        // create data item
        const obj = {
          time: new Date(), // mandatory
          category: json.height.low, // mandatory
          type: "circle", // optional (defaults to circle)
          color: "black", // optional (defaults to black)
          opacity: 0.8, // optional (defaults to 1)
          size: 5 // optional (defaults to 6)
        };

        if (blocks >= ceiling) {
          const floor = blocks - 10;
          const ceiling = blocks + 10;
          this.chart.yDomain(this.calculateY(floor, ceiling));
        }

        // send the data item to the chart
        this.chart.datum(obj);
      } catch (error) {
        console.log(error);
        this.setState({ loginError: "Error acccesing api" });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  render() {
    return <div id="blocks" />;
  }
}

export default Blocks;
