/*
*
*	Example TCP Client (NET), connects to port 6000 and sends Ping to the servers
*
*/

//	Dependencies
const net = require('net');


//	Define the message
var outboundMessage = 'Ping';

//	Create the client
var client = net.createConnection({'port': 6000}, function() {
	//	Send the message
	client.write(outboundMessage);
});


//	When the server writes back, log what it says, then kill the client
client.on('data', (inboundMessage) => {
	var messageString = inboundMessage.toString();
	console.log(`I wrote ${outboundMessage}, and they wrote ${inboundMessage}`);
	client.end();
});