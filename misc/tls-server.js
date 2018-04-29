/*
*
* 	Example TLS Server (listens to port 6000 and sends the word pong to the client)
*
*/

//	Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');


//	Server Options
var options = {
	'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};


//	Create server
var server = tls.createServer(options, (connection) => {
	//	Send the word pong
	var outboundMessage = 'Pong';
	connection.write(outboundMessage);

	//	When the client writes something, log it out
	connection.on('data', (inboundMessage) => {
		var messageString = inboundMessage.toString();
		console.log(`I wrote ${outboundMessage}, and they wrote ${inboundMessage}`);
	});
});


//	Listen
server.listen(6000);