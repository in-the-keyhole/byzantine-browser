import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import config from 'react-global-configuration';

import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'

import {
  Navbar, 
  Nav, 
  NavItem, 
  NavDropdown,
  MenuItem,
  Button
} from 'react-bootstrap';

import SelectChannel from './SelectChannel.js';
import Channel from './channel/channel.js';
import Metrics from './metrics/metrics.js';

config.set({foo:'hello',
            baseurl: process.env.BASE_URL || 'http://localhost:4001'
});

class App extends Component {
  render() {

    const Main = () => (
      <main>
      <Switch>
         <Route exact path='/' component={SelectChannel}/>
         <Route exact path='/channel/:channelid/:blocknumber' component={Channel}/>
         <Route exact path='/metrics/:channelid/:blocknumber' component={Metrics}/>
      </Switch>
    </main> 
     );    



    return (
      <div>
      <BrowserRouter>
        <div>
           <div>
           <Navbar>
               <Navbar.Header>
               <Navbar.Brand>
                   <a href="/">KHS Blockchain Browser&#123;for Hyperledger&#125;</a>
               </Navbar.Brand>
               </Navbar.Header>
      
               
           </Navbar>
           </div>
           <div className="container">
             <div className="row">
              
                <div>
                   <Main />
                 </div>
         
              </div>
             </div>
        </div>
      </BrowserRouter>  

    </div>  
    );
  }
}

export default App;
