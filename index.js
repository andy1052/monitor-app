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

	//	Send the response
	res.end("Hello World\n");

	//	Log the request path
	console.log("Request received with this payload: ", buffer);
	});
});




//Start the server, and have it listen on port 3000
server.listen(3000, () => {
	console.log("server is listening on port 3000");
});