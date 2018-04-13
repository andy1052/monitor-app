/*
*Primary file for the API
*
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;




//The server should respond to all requests with a string
var server = http.createServer((req, res) => {


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
		"payload" : buffer
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
});




//Start the server, and have it listen on port 3000
server.listen(3000, () => {
	console.log("server is listening on port 3000");
});

//	Define handlers
var handlers = {};

//	Define sample handler
handlers.sample = function(data, callback) {
	//	Callback a http status code, and a payload object
	callback(406, {"name" : "sample handler"});
};

//	Not found handler
handlers.notFound = function(data, callback) {
	callback(404);
};

//	Define a request router
var router = {
	"sample": handlers.sample
};





