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
import {config} from './Config.js';


class SelectChannel extends Component {

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
      
      
        // remove old before fetchin a new one
        localStorage.removeItem("channelid");

        var self = this;
        axios({// using axios directly to avoid redirect interceptor
            method:'post',
            url:'/blockinfo',
            baseURL: config.apiserver,
            data: self.state
        }).then(function(res) {
            console.log(res.data);
            

            if (res.data && res.data !== '') {
        
              localStorage.setItem("blocks",res.data.height.low-1);
              localStorage.setItem("currentblocknumber",res.data.height.low-1);
              localStorage.setItem("channelid",self.state.channelid);
             
              window.location = ('/channel');
              
             
            } else {
                self.error = true;
                self.setState({loginError: 'Error Accessing Channel'});
                localStorage.removeItem("channelid");
            }
        }).catch(function(err){
            console.log('ERROR '+ err);
           
        });

        ev.preventDefault();
    }    





    render() {

        let err = <div></div>;

        if (this.error) {
          err =  <div class="alert alert-danger" role="alert">
         Channel not found...
            </div>
         }
       

        const selectChannel = (<div class="jumbotron">
        <h1 class="display-3">Hyperledger Browser</h1>
        <p class="lead">Browse Blocks and Transaction Data</p>
        <hr class="my-4"></hr>
        <p>Input Channel name to Browse</p>
        <form className="form" onSubmit={this.handleSubmit}>
        <p> <input type="text" class="form-control" name="channelid"  placeholder="Channel Id" onChange={this.handleInputChange}  />  </p>
         {err}
        <p class="lead">
        <button type="submit" class="btn btn-primary btn-lg">Browse</button>
        </p>
        </form> 
         </div>);
     

        return selectChannel;
            
            }
        
        }
        
        export default SelectChannel
