/*
*
*	Example TLS Client, connects to port 6000 and sends Ping to the servers
*
*/

//	Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');


//	Server Options
var options = {
	'ca': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')) // Only required because we're using a self-signed certificate
};


//	Define the message
var outboundMessage = 'Ping';

//	Create the client
var client = tls.connect(6000, options, function() {
	//	Send the message
	client.write(outboundMessage);
});


//	When the server writes back, log what it says, then kill the client
client.on('data', (inboundMessage) => {
	var messageString = inboundMessage.toString();
	console.log(`I wrote ${outboundMessage}, and they wrote ${inboundMessage}`);
	client.end();
});