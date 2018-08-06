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
import Peers from './peers.js';
import Info from './info.js';


class Channel extends Component {

   constructor(props) {
        super(props);
        this.channelid = this.props.match.params.channelid;
        this.state = { channelid: ''};
   

    }

  
    render() {
        return (
           
            <div className="container">
                <div className="row">
                    <div className="col-md-4"> <Peers channelid={this.channelid}/>  </div>
                    <div className="col-md-4"> <Info channelid={this.channelid} />  </div>
                   
                </div>        
            </div>


            ) 
            
            }
        
        }
        
        export default Channel
