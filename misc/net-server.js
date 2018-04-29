/*
*
* 	Example TCP (Net) Server (listens to port 6000 and sends the word pong to the client)
*
*/

//	Dependencies
const net = require('net');


//	Create server
var server = net.createServer((connection) => {
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