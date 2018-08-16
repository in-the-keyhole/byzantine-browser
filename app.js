/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
var query = require('./app/query.js');
var lab = require('./app/createLab.js');
var channels = require('./app/channelinfo.js');
var peers = require('./app/peers.js');
var blockinfo = require('./app/blockinfo.js');
var block = require('./app/block.js');

require('./config.js');
var hfc = require('fabric-client');
logger.setLevel('debug');

var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});
logger.info('****************** SERVER STARTED ************************');
logger.info('**************  http://' + host + ':' + port +
	'  ******************');
server.timeout = 240000;



///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// API ENDPOINTS /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Query all
app.get('/queryAllLabs', function(req, res) {
	logger.debug('================ Query All ======================');
	
	query.getAllLabs('queryAllLabs')
	.then(function(
		message) {
		res.send(message);
	});
});


// Query all
app.get('/queryByState', function(req, res) {
	logger.debug('================ Query By State ======================');
	
	query.getAllLabs('queryAllLabs')
	.then(function(
		message) {

		var results = JSON.parse(message);
		var data = [];
		for (var i = 0; i < results.length ; i++) {

			if (results[i].Record.state.toUpperCase() == req.query.state.toUpperCase() ) {

				data.push(results[i]);
			
			}


		}
		

		res.send(JSON.stringify(data));
	});
});



// Create Lab
app.post('/createLab', function(req, res) {
	logger.debug('================ Create Lab ======================');
	
	// TODO Validate Form values...
	var dateTime = req.body.dateTime;
	var gender = req.body.gender;
	var testType = req.body.testType;
	var dob = req.body.dob;
	var result = req.body.result;
	var city = req.body.city;
	var state = req.body.state;
	

	lab.createLab({dateTime: dateTime, gender: gender, testType: testType, dob: dob, result: result, city: city, state: state} )
	.then(function(message) {
		res.send(message);
	});
});


// get channels
app.post('/channel', function(req, res) {
	logger.debug('================ Create Lab ======================');
	
	// TODO Validate Form values...
	var channelid = req.body.channelid;
	
	
	channels.getChannelInfo(channelid)
	.then(function(message) {
		res.send(message);
	});
});


// get channels
app.post('/peers', function(req, res) {
	logger.debug('================ Peers ======================');
	
	var channelid = req.body.channelid;

	peers.getPeers(channelid)
	.then(function(message) {
		res.send(message);
	});
});


// get channels
app.post('/blockinfo', function(req, res) {
	logger.debug('================ Peers ======================');
	
	// TODO Validate Form values...
	var channelid = req.body.channelid;

	blockinfo.getBlockInfo(channelid)
	.then(function(message) {
		res.send(message);
	});
});


// get block
app.post('/block', function(req, res) {
	logger.debug('================ Block ======================');
	
	var channelid = req.body.channelid;
	var blocknumber = req.body.blocknumber;
 
	block.getBlock(channelid,blocknumber)
	.then(function(message) {
		res.send(message);
	});
});


// get block hash
app.post('/blockhash', function(req, res) {
	logger.debug('================ Block ======================');
	
	var number  = req.body.number;
	var prev = req.body.prevhash;
	var data = req.body.datahash;
 
	block.getBlockHash({number: number, previous_hash: prev, data_hash: data} )
	.then(function(message) {
		res.send(message);
	});
});





