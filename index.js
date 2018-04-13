/*
*Primary file for the API
*
*/

//Dependencies
const http = require('http');
const url = require('url');




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

	//	Send the response
	res.end("Hello World\n");

	//	Log the request path
	console.log("Request received on path: " + trimmedPath + "this method: ", method + "and with these query string params: ", queryStringObject);

});




//Start the server, and have it listen on port 3000
server.listen(3000, () => {
	console.log("server is listening on port 3000");
});