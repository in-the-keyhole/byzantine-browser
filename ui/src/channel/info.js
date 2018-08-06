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


class Info extends Component {

    constructor(props) {

        super(props);
        this.channelid = props.channelid;
        this.state = { info: ''};
   

    }



    componentDidMount() {

        
        var base = '';
        if (window.location.hostname === 'localhost') {
            base = 'http://localhost:4000';
        }

        console.log('Accessing channels');
        var self = this;
        axios({// using axios directly to avoid redirect interceptor
            method:'post',
            url:'/blockinfo?channelid='+self.channelid,
            baseURL: base,
            data: {channelid: self.channelid}
        }).then(function(res) {
            
    
            self.setState( {info: JSON.stringify(res.data) } );

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
            <p class="card-text">Channel: {this.channelid} </p>
            <p class="card-text">Info: {this.state.info} </p>
          </div>

            ) 
            
            }
        
        }
        
        export default Info
