'use strict';
/** 
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
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var EventHub = require('fabric-client/lib/EventHub.js');
var config = require('../config.js');
var log4js = require('log4js');
var logger = log4js.getLogger('app/util.js');

logger.setLevel(config.loglevel);


//var channel = null;
var channelid = null;
var client = null;
var peer = null;
var path = path.join(__dirname, config.wallet_path);
var org = config.org;
var pool = [];


var connectChannel = function (channel_id) {

    return Promise.resolve().then(() => {
        logger.info("Create a client and set the wallet location");
        client = new hfc();
        return hfc.newDefaultKeyValueStore({ path: path });
    }).then((wallet) => {
        logger.info("Set wallet path, and associate user ", config.user_id, " with application");
        client.setStateStore(wallet);
        return client.getUserContext(config.user_id, true);
    }).then((user) => {

     
        console.log("POOL"+pool.length);

       var channel = get(channel_id);

        logger.debug("Check user is enrolled, and set a query URL in the network");
        if (user === undefined || user.isEnrolled() === false) {
            logger.error("User not defined, or not enrolled - error");
        }


        if (channelid != channel_id && channel != null) {
            channel.close();
            channel = null;
        }

      
        console.log("CHANNEL is null " + channel == null )

        if (channel == null ) {


            channel = client.newChannel(channel_id);
            add(channel_id,channel);
            peer = client.newPeer(config.network_url);

            channel.addPeer(peer);
            channelid = channel_id;
            let channel_event_hub = channel.newChannelEventHub(peer);

            channel_event_hub.connect(true);

            // keep the block_reg to unregister with later if needed
            let block_reg = channel_event_hub.registerBlockEvent((block) => {
                logger.debug('Successfully received the block event - ' + JSON.stringify(block));

                global.socket.emit('blocks', (Number(block.header.number) + 1));

            }, (error) => {
                logger.error('Failed to receive the block event ::' + error.toString());


            });


            logger.info("Is Event Hub Connected " + channel_event_hub.isconnected());
            logger.info('Event Hub Registerd: ' + block_reg);
           


        }

        return channel;
    }).then((c) => {
        return c;
    }

    ).catch((err) => {
        logger.error("Caught Error", err);
    });

};

var get = function (cid) {


    for (var i = 0 ; i < pool.length; i++) {
    
       if (pool[i].channelid === cid)
           { return pool[i].channel; }   
     
    }

    return null;

}

var add = function(id,c) {

    let add = true;
    for (var i = 0; i < pool.length ; i++) {
        if ( pool[i].channelid == id) {
            add = false; 
        }

    }

    if (add) {
      console.log("*** Item  not found adding");         
      pool.push({channelid: id, channel: c} ); 
    } else {
        console.log("****Item found")
    }

}


var getClient = function() {
        return client;
}


exports.connectChannel = connectChannel;
exports.getClient = getClient;