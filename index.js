/*
*Primary file for the API
*
*/

//Dependencies
const http = require('http');





//The server should respond to all requests with a string
var server = http.createServer((req, res) => {



	//	Send the response
	res.end("Hello World\n");

});




//Start the server, and have it listen on port 3000
server.listen(3000, () => {
	console.log("server is listening on port 3000");
});