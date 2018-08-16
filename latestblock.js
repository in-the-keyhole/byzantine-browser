'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Hyperledger Fabric Sample Query Program
 */

var hfc = require('fabric-client');
var path = require('path');

var options = {
    wallet_path: path.join(__dirname, './hfc-key-store'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'lab',
    network_url: 'grpc://localhost:7051'
};

var channel = {};
var client = null;
var peer = null;

Promise.resolve().then(() => {
    console.log("Create a client and set the wallet location");
    client = new hfc();
    return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
}).then((wallet) => {
    console.log("Set wallet path, and associate user ", options.user_id, " with application");
    client.setStateStore(wallet);
    return client.getUserContext(options.user_id, true);
}).then((user) => {
    console.log("Check user is enrolled, and set a query URL in the network");
    if (user === undefined || user.isEnrolled() === false) {
        console.error("User not defined, or not enrolled - error");
    }
    channel = client.newChannel(options.channel_id);
   
    channel.addPeer(client.newPeer(options.network_url));
    return;
}).then(() => {
    
     return channel.queryBlock(0);
    //return channel.queryInfo(peer);
    //return channel.queryInfo();
    //return channel.getPeers();
}).then((query_responses) => {
     
    console.log("Block ", JSON.stringify(query_responses));
    return JSON.stringify(query_responses);
}).catch((err) => {
    console.error("Caught Error", err);
});
