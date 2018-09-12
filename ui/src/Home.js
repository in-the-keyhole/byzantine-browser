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
import Channel from './channel/channel.js';
import SelectChannel from './SelectChannel.js';

import {
    BrowserRouter,
    Switch,
    Route
  } from 'react-router-dom'
  

class Home extends Component {

    constructor(props) {

        super(props);
        this.state = { channelid: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.error = false;

    }

    handleInputChange(ev) {
        const target = ev.target;
        this.setState({[target.name]: target.value});
        this.setState({error: ''});
    }


    handleSubmit(ev) {
      
    
        var base = '';
        if (window.location.hostname === 'localhost') {
           base = 'http://localhost:4001';
        }

        console.log('Accessing channels');
        var self = this;
        axios({// using axios directly to avoid redirect interceptor
            method:'post',
            url:'/blockinfo',
            baseURL: base,
            data: self.state
        }).then(function(res) {
            console.log(res.data);
            

            if (res.data && res.data !== '') {
        
              localStorage.setItem("blocks",res.data.height.low-1);
              localStorage.setItem("channelid",self.state.channelid);
             
              window.location = ('/channel/'+self.state.channelid+'/'+(res.data.height.low-1));
              
             
            } else {
                self.error = true;
                self.setState({loginError: 'Error Accessing Channel'});
            }
        }).catch(function(err){
            console.log('ERROR '+ err);
           
        });

        ev.preventDefault();
    }    





    render() {

    
         const blocks =  <Channel />;
         const selectChannel = <SelectChannel />;   


         let channelId = localStorage.getItem("channelid");

    

        return channelId ? blocks : selectChannel;
            
            }
        
        }
        
        export default Home
