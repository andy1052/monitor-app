/* 
*
*	Example http2 server
*
*/

//	Dependencies
const http2 = require('http2');


//	Init the server
var server = http2.createServer();


//	On a stream, send back hello world html
server.on('stream', (stream, headers) => {
	stream.respond({
		"status": 200,
		"content-type": "text/html"
	});
	stream.end('<html><body><p>Hello World!</p></body></html>');
});


//	Tell the server to listen on 6000
server.listen(6000);