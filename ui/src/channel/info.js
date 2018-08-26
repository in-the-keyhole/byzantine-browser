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
import {subscribeToBlocks} from '../SubscribeToBlocks.js';
import {config} from '../Config.js';


class Info extends Component {

    constructor(props) {

        super(props);
        this.channelid = props.channelid;
        this.state = { info: ''};

        subscribeToBlocks((err, blocks) => this.setState({ 
            blocks: blocks 
          }));

    }



    componentDidMount() {

        
        console.log('Accessing channels');
        var self = this;
        axios({// using axios directly to avoid redirect interceptor
            method:'post',
            url:'/blockinfo?channelid='+self.channelid,
            baseURL: config.apiserver,
            data: {channelid: self.channelid}
        }).then(function(res) {
            

           // alert (JSON.stringify(res.data));
            var json = JSON.parse(JSON.stringify(res.data));

            var hash = "";
            var bytes = json.currentBlockHash.buffer.data;
            var count = bytes.length;
            for(var index = 0; index < bytes.length; index += 1) {
              hash += String.fromCharCode(bytes[index]);
            }
    
            self.setState( {blocks: (json.height.low), currentBlockhash: hash } );
           

        }).catch(function(err){
            self.setState({loginError: 'Error Accessing Channel'});
        });

      }

  
    render() {


        return (
            <div class="card">
            <div class="card-block">
              <h3 class="card-title">Blockchain Info</h3>

             
            </div>
            <p>Channel: {this.channelid} </p>
            <p># Blocks: {this.state.blocks}</p>
            
    
            
          </div>

            ) 
            
            }
        
        }
        
        export default Info
