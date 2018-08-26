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
var util = require('./util.js');
var log4js = require('log4js');
var logger = log4js.getLogger('app/channelinfo.js');
logger.setLevel(config.loglevel);

var getChannelInfo = function(channel_id) {
	
return Promise.resolve().then(() => {
    return util.connectChannel(channel_id);
}).then((channel) => {
   
    var peers = channel.getChannelPeers();
    logger.debug("Peers "+peers);
   
    return peers;
}).then((query_responses) => {
    console.log("returned from query");
    if (!query_responses.length) {
        logger.info("No payloads were returned from query");
    } else {
        logger.info("Query result count = ", query_responses.length)
    }
    if (query_responses[0] instanceof Error) {
        logger.error("error from query = ", query_responses[0]);
    }
     logger.debug("Response is ", query_responses[0].toString());
	return query_responses[0].toString();
}).catch((err) => {

    logger.error("Caught Error", err);
});

};


exports.getChannelInfo = getChannelInfo;
