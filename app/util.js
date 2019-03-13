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
const fsExtra = require('fs-extra');
var path = require('path');
var join = path.join;
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

var network_profile = {};

var connectChannel = function (channel_id) {

    return Promise.resolve().then(() => {
        logger.info("Create a client and set the wallet location");
        client = new hfc();
        return hfc.newDefaultKeyValueStore({ path: path });
    }).then(async (wallet) => {
        logger.info("Set wallet path, and associate user ", config.user_id, " with application");
        client.setStateStore(wallet);

        // If network profile is included
        if (config.network_profile) {
            const netprof = join(__dirname, config.network_profile);
            let netProfileStr = await fsExtra.readFile(netprof, 'utf8');
            network_profile = JSON.parse(netProfileStr);
            client.loadFromConfig(network_profile);
            await client.initCredentialStores();
        }

        let user = await client.getUserContext(config.user_id, true);
        return client.setUserContext(user);
    }).then((user) => {
        console.log("POOL" + pool.length);

        var channel = get(channel_id);
        logger.debug("Check user is enrolled, and set a query URL in the network");
        if (user === undefined || user.isEnrolled() === false) {
            logger.error("User not defined, or not enrolled - error");
        }

        if (channel == null) {
            try {
                channel = client.newChannel(channel_id);

                if (config.peer_pem) {
                    // If PEM is needed, include it
                    peer = client.newPeer(config.network_url, {
                        pem: config.peer_pem,
                        'ssl-target-name-override': config.ssl_target_name_override
                    });
                } else {
                    peer = client.newPeer(config.network_url);
                }
            } catch (error) {
                logger.error("Error creating new channel " + channel_id + error);
                return null;
            }

            channel.addPeer(peer);
            channelid = channel_id;
            let channel_event_hub = channel.newChannelEventHub(peer);

            add(channel_id, channel);
            // keep the block_reg to unregister with later if needed
            let block_reg = channel_event_hub.registerBlockEvent((block) => {
                logger.debug('Successfully received the block event - ' + JSON.stringify(block));

                global.socket.emit('blocks', (Number(block.header.number) + 1));

            }, (error) => {
                logger.error('Failed to receive the block event ::' + error.toString());


            });



            channel_event_hub.connect(true);


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


    for (var i = 0; i < pool.length; i++) {

        if (pool[i].channelid === cid) { return pool[i].channel; }

    }

    return null;

}

var add = function (id, c) {

    let add = true;
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].channelid == id) {
            add = false;
            break;
        }

    }

    if (add) {
        console.log("*** Item  not found adding");
        pool.push({ channelid: id, channel: c });
    } else {
        console.log("****Item found")
    }

}


var getClient = function () {
    return client;
}

var removeChannel = function (cid) {

    var index = -1;
    for (var i = 0; i < pool.length; i++) {

        if (pool[i].channelid === cid) { index = i }

    }

    if (index >= 0) {
        pool.splice(index, 1);
    }

    return;

}


exports.connectChannel = connectChannel;
exports.getClient = getClient;
exports.removeChannel = removeChannel;