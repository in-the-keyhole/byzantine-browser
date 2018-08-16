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
var util = require('./util.js');

var getBlockInfo = function(channel_id) {
	
return Promise.resolve().then(() => {
    return util.connectChannel(channel_id);
}).then((c) => {
   
    return c.queryInfo();
}).then((query_responses) => {
    console.log("returned from query"+ JSON.stringify(query_responses));
   
	return  JSON.stringify(query_responses);
}).catch((err) => {
    console.error("Caught Error", err);
});

};


exports.getBlockInfo = getBlockInfo;
