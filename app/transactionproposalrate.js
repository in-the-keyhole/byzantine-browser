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

var config = require('../config.js');
var log4js = require('log4js');
var logger = log4js.getLogger('app/transactionproposalrate.js');
var util = require('./util.js');


logger.setLevel(config.loglevel);

/**
 * 
 * Will invoke a specified chaincode with a "noop" function name. Access time will be
 * specified. 
 * 
 *
 * } channel_id 
 * @param {*} chaincode 
 */



var getTransactionProposalRate = function(channel_id,chaincode) {
	
return Promise.resolve().then(() => {
    
    return util.connectChannel(channel_id);
}).then((c) => {
   
    let tx_id = util.getClient().newTransactionID();

    let peer = c.getChannelPeers()[0];
    let targets = [];
    targets.push(peer);

    const request = {
        targets: targets,
        chaincodeId: chaincode,
        txId: tx_id,
        fcn: 'queryAllLabs',
        args: []
       
    };
    return c.sendTransactionProposal(request); 

}).then((query_responses) => {
    logger.debug("returned from query"+ JSON.stringify(query_responses));
   
	return  JSON.stringify(query_responses);
}).catch((err) => {
    logger.error("Caught Error", err);

});

};



exports.getTransactionProposalRate = getTransactionProposalRate;
