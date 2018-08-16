'use strict';
/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var EventHub = require('fabric-client/lib/EventHub.js');
var config = require('./config.json');
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');


var channel = null;
var channelid  = null;
var client = null;
var peer = null;
var path =  path.join(__dirname,config.wallet_path);
var org = config.org;

var connectChannel = function(channel_id) {
	
return Promise.resolve().then(() => {
    console.log("Create a client and set the wallet location");
    client = new hfc();
    return hfc.newDefaultKeyValueStore({ path: path });
}).then((wallet) => {
    console.log("Set wallet path, and associate user ", config.user_id, " with application");
    client.setStateStore(wallet);
    return client.getUserContext(config.user_id, true);
}).then((user) => {
    console.log("Check user is enrolled, and set a query URL in the network");
    if (user === undefined || user.isEnrolled() === false) {
        console.error("User not defined, or not enrolled - error");
    }

    
    if (channelid != channel_id && channel != null) {
        channel.close();
        channel = null;
    }

    if (channel == null) {
    
       channel = client.newChannel(channel_id); 
       peer = client.newPeer(config.network_url);
       channel.addPeer(peer);
       channelid = channel_id;
    }   

    return;
}).then(() => {
    return channel;
}

).catch((err) => {
    console.error("Caught Error", err);
});

};


exports.connectChannel = connectChannel;