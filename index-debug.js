/*
*Primary file for the API
*
*/

// Dependencies
var server = require('./lib/server');
var workers = require('./lib/workers');
var cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

//	Declare the app
var app = {};

debugger;
//	Init function
app.init = () => {
	debugger;
	//	Start the server
	server.init();
	debugger;
	//	Start the workers
	workers.init();
	debugger;
	//	Start the CLI, but make sure it start up last
	setTimeout(function() {
		cli.init();
	}, 50);
	debugger;
	//	Set foo at 1
	var foo =1;
	console.log("Jsut assigned 1 to foo");
	debugger;
	//	Increment foo
	foo++;
	console.log("Just incremented foo");
	//	Square foo
	foo = foo * foo;
	console.log("Just squared foo");
	debugger;
	//	Convert foo to a string
	foo = foo.toString();
	console.log("Just converted foo to string");
	debugger;
	//	Call the init script that will throw
	exampleDebuggingProblem.init();
	console.log("Just called the library");
	debugger;
};


//	Execute init function
app.init();


//	Export the app
module.exports = app;