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
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('app.js');
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
var channels = require('./app/channelinfo.js');
var peers = require('./app/peers.js');
var blockinfo = require('./app/blockinfo.js');
var block = require('./app/block.js');
var appconfig = require('./config.js');
var chaincodes = require('./app/chaincodes.js');
var channelconfig = require('./app/channelconfig.js');
var txproposalrate = require('./app/transactionproposalrate.js');
var path = require('path');


var hfc = require('fabric-client');

//var host = process.env.HOST || hfc.getConfigSetting('host');
//var port = process.env.PORT || hfc.getConfigSetting('port');
//var loglevel = process.env.PORT || hfc.getConfigSetting('loglevel');

var host = appconfig.host;
var port = appconfig.port;
var loglevel = appconfig.loglevel;

logger.setLevel(loglevel);

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

// For heroku
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, './ui/build')));

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
response.sendFile(path.resolve(__dirname, './ui/build', 'index.html'));
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function () { });
logger.info('****************** SERVER STARTED ************************');
logger.info('**************  http://' + host + ':' + port +
	'  ******************');
server.timeout = 240000;

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START WEBSOCKET SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var io = require('socket.io')(server);
io.on('connection', function (socket) {
	logger.info('A new WebSocket connection has been established');
});


// Set global socket
global.socket = io;


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// API ENDPOINTS /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


// get channels
app.post('/channel', function (req, res) {
	logger.debug('================ Create Lab ======================');

	// TODO Validate Form values...
	var channelid = req.body.channelid;


	channels.getChannelInfo(channelid)
		.then(function (message) {
			res.send(message);
		});
});


// get channels
app.post('/peers', function (req, res) {
	logger.debug('================ Peers ======================');

	var channelid = req.body.channelid;

	peers.getPeers(channelid)
		.then(function (message) {
			res.send(message);
		});
});


// get channels
app.post('/blockinfo', function (req, res) {
	logger.debug('================ Peers ======================');

	// TODO Validate Form values...
	var channelid = req.body.channelid;

	blockinfo.getBlockInfo(channelid)
		.then(function (message) {
			res.send(message);
		});
});


// get block
app.post('/block', function (req, res) {
	logger.debug('================ Block ======================');

	var channelid = req.body.channelid;
	var blocknumber = req.body.blocknumber;

	block.getBlock(channelid, blocknumber)
		.then(function (message) {
			res.send(message);
		});
});


// get block hash
app.post('/blockhash', function (req, res) {
	logger.debug('================ Block ======================');

	var number = req.body.number;
	var prev = req.body.prevhash;
	var data = req.body.datahash;

	block.getBlockHash({ number: number, previous_hash: prev, data_hash: data })
		.then(function (message) {
			res.send(message);
		});
});


// get block hash
app.post('/chaincodes', function (req, res) {
	logger.debug('================ Chaincodes ======================');

	var channelid = req.body.channelid;

	chaincodes.getChaincodes(channelid)
		.then(function (message) {
			res.send(message);
		});
});


// get block hash
app.post('/channelconfig', function (req, res) {
	logger.debug('================ Chaincodes ======================');

	var channelid = req.body.channelid;
	var blocknumber = req.body.blocknumber;

	block.getBlock(channelid, blocknumber)
		.then(function (response) {

			var json = JSON.parse(response);
			// Get last config block from Metadata
			var configBlock = parseInt(json.metadata.metadata[1].value.index);
			 
			block.getBlock(channelid,configBlock)
			.then(function (message) {
				res.send(message);
			});

		});


});





// get block hash
app.post('/txproposalrate', function (req, res) {
	logger.debug('================ Tx Proposal TX rate======================');

	var channelid = req.body.channelid;
	var chaincode = req.body.chaincode;

	txproposalrate.getTransactionProposalRate(channelid,chaincode)
		.then(function (message) {
			res.send(message);
		});
});
