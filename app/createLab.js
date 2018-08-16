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
var targets = [];
var tx_id = null;


var createLab = function(lab) {
	
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
    var peerObj =client.newPeer(config.network_url);
    channel.addOrderer(client.newOrderer(config.orderer_url));
    channel.addPeer(peerObj);
    targets.push(peerObj);
    return;
}).then(() => {
    console.log("Make query");
    tx_id = client.newTransactionID();
    console.log("Assigning transaction_id: ", tx_id._transaction_id);

    // queryCar - requires 1 argument, ex: args: ['CAR4'],
    // queryAllCars - requires no arguments , ex: args: [''],
    console.log("labs" + JSON.stringify(lab));
    const request = {
        targets: targets,
        chaincodeId: config.chaincode_id,
        txId: tx_id,
        fcn: 'createLab',
        args: [ lab.gender, lab.dob, lab.city, lab.state, lab.testType, lab.result, lab.dateTime]
       
    };
    return channel.sendTransactionProposal(request);
}).then((results) => {
    var proposalResponses = results[0];
    var proposal = results[1];
    var header = results[2];
    let isProposalGood = false;
    if (proposalResponses && proposalResponses[0].response &&
        proposalResponses[0].response.status === 200) {
        isProposalGood = true;
        console.log('transaction proposal was good');
    } else {
        console.error('transaction proposal was bad');
    }
    if (isProposalGood) {
        console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
            proposalResponses[0].response.status, proposalResponses[0].response.message,
            proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
        var request = {
            proposalResponses: proposalResponses,
            proposal: proposal,
            header: header
        };
        // set the transaction listener and set a timeout of 30sec
        // if the transaction did not get committed within the timeout period,
        // fail the test
        var transactionID = tx_id.getTransactionID();
        var eventPromises = [];
        let eh = client.newEventHub();
        eh.setPeerAddr(config.event_url);
        eh.connect();

        let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
                eh.disconnect();
                reject();
            }, 30000);

            eh.registerTxEvent(transactionID, (tx, code) => {
                clearTimeout(handle);
                eh.unregisterTxEvent(transactionID);
                eh.disconnect();

                if (code !== 'VALID') {
                    console.error(
                        'The transaction was invalid, code = ' + code);
                    reject();
                } else {
                    console.log(
                        'The transaction has been committed on peer ' +
                        eh._ep._endpoint.addr);
                    resolve();
                }
            });
        });
        eventPromises.push(txPromise);
        var sendPromise = channel.sendTransaction(request);
        return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
            console.log(' event promise all complete and testing complete');
            return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
        }).catch((err) => {
            console.error(
                'Failed to send transaction and get notifications within the timeout period.'
            );
            return 'Failed to send transaction and get notifications within the timeout period.';
        });
    } else {
        console.error(
            'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
        );
        return 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
    }
}, (err) => {
    console.error('Failed to send proposal due to error: ' + err.stack ? err.stack :
        err);
    return 'Failed to send proposal due to error: ' + err.stack ? err.stack :
        err;
}).then((response) => {
    if (response.status === 'SUCCESS') {
        console.log('Successfully sent transaction to the orderer.');
        return tx_id.getTransactionID();
    } else {
        console.error('Failed to order the transaction. Error code: ' + response.status);
        return 'Failed to order the transaction. Error code: ' + response.status;
    }
}, (err) => {
    console.error('Failed to send transaction due to error: ' + err.stack ? err
        .stack : err);
    return 'Failed to send transaction due to error: ' + err.stack ? err.stack :
        err;
});



// end of promise

};



exports.createLab = createLab;
