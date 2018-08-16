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


var channel = {};
var client = null;
var path =  path.join(__dirname,config.wallet_path);
var org = config.org;

var getAllLabs = function(query) {
	
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
    channel = client.newChannel(config.channel_id);
    channel.addPeer(client.newPeer(config.network_url));
    return;
}).then(() => {
    console.log("Make query");
    var transaction_id = client.newTransactionID();
    console.log("Assigning transaction_id: ", transaction_id._transaction_id);

    const request = {
        chaincodeId: config.chaincode_id,
        txId: transaction_id,
        fcn: query,
        args: ['']
    };
    return channel.queryByChaincode(request);
}).then((query_responses) => {
    console.log("returned from query");
    if (!query_responses.length) {
        console.log("No payloads were returned from query");
    } else {
        console.log("Query result count = ", query_responses.length)
    }
    if (query_responses[0] instanceof Error) {
        console.error("error from query = ", query_responses[0]);
    }
	console.log("Response is ", query_responses[0].toString());
	return query_responses[0].toString();
}).catch((err) => {
    console.error("Caught Error", err);
});

};


exports.getAllLabs = getAllLabs;
