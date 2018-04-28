/*
*Primary file for the API
*
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');

//	Declare the app
var app = {};

//	Declare a global that strict should catch!
foo = 'bar';

//	Init function
app.init = () => {

	//	Start the server
	server.init();

	//	Start the workers
	workers.init();

	//	Start the CLI, but make sure it start up last
	setTimeout(function() {
		cli.init();
	}, 50);
};


//	Execute init function
app.init();


//	Export the app
module.exports = app;