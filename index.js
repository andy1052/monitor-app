/*
*Primary file for the API
*
*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

//Local Files
const config = require('./lib/config');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

//Sample of sending a twilio request
helpers.sendTwilioSms('7802003429', "Hello", function(err) {
	console.log(`This was the error: ${err}`);
});

// const _data = require('./lib/data');

// Test File write
// _data.create('test', 'newFile', {'foo': 'bar'}, function(err) {
// 	console.log('this was the error', err);
// });

//	Read File Test
// _data.read('test', 'newFile', function(err, data) {
// 	console.log('this was the error', err);
// 	console.log('this was the data', data);
// });

//	Update File Test
// _data.update('test', 'newFile', {'red': 'blue'}, function(err) {
// 	console.log('this was the error', err);
// });

//	Delete File Test
// _data.delete('test', 'newFile', function(err) {
// 	console.log('this was the error', err);
// });




//The server should respond to all requests with a string
//pass in req and res to unified server for http server.
var httpServer = http.createServer((req, res) => {
	unifiedServer(req, res); 
});

//Start the http server
httpServer.listen(config.httpPort, () => {
	console.log(`server is listening on port ${config.httpPort}`);
});


//	Instantiate the https server with options arguments
//	using the fs module, we want these key and cert files read in synchronously
var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	unifiedServer(req, res);
});

//	Start the https server
httpsServer.listen(config.httpsPort, () => {
	console.log(`server is listening on port ${config.httpsPort}`);
});




//	All the server logic for both the http and https servers
var unifiedServer = function(req, res) {
	//	Get the url and parse it
	var parsedUrl = url.parse(req.url, true);

	//	Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,"")

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	//	Get the http METHOD
	var method = req.method.toLowerCase();

	// Get the Headers as an object
	var headers = req.headers;

	//	Get the payload, if there is any, which comes in as a stream!
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data', (data) => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

	//	Choose the handler this request should go to. If one is not found, use the not found handler
	var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

	//	Construct the data object to send to the handler
	var data = {
		"trimmedPath" : trimmedPath,
		"queryStringObject" : queryStringObject,
		"method" : method,
		"headers" : headers,
		"payload" : helpers.parseJsonToObject(buffer)
	};

	//	Route the request to the handler specified in the router
	chosenHandler(data, (statusCode, payload) => {
		//	Use the status code called back by the handler or default to 200
		statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

		//	Use the payoad called back by the handler, or default to empty object
		payload = typeof(payload) === 'object' ? payload : {};

		//	Convert the payload to a string
		var payloadString = JSON.stringify(payload);

		//	Return response
		res.setHeader('Content-Type', 'application/json'); //This formely tells browsers, etc, that we are sending responses back in JSON format
		res.writeHead(statusCode);
		res.end(payloadString);

		//	Log the request path
		console.log("Returning this response: ", statusCode, payloadString);
		});
	});
};



//	Define a request router
var router = {
	"ping": handlers.ping,
	"users": handlers.users,
	"tokens": handlers.tokens,
	"checks": handlers.checks
};





