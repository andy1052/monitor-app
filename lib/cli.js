/*
*
*	CLI related tasks
*
*/


//	Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
var e = new _events();


//	Instantiate the CLI module object
var cli = {};


//	Input processor
cli.processInput = (str) => {
	str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : false;

	//	Only process the input if the user actually wrote something, otherwise ingore it
	if (str) {
		//	Codify the unique strings that identify the unique questions allowed to be asked
		var uniqueInputs = [
			"man",
			"help",
			"exit",
			"stats",
			"list users",
			"more user info",
			"list checks",
			"more check info",
			"list logs",
			"more log info"
		];

		//	Go through the possible inputs and emit an event when a match is found
		var matchFound = false;
		var counter = 0;
		uniqueInputs.some((input) => {
			if (str.toLowerCase().indexOf(input) > -1) {
				matchFound = true;
				//	Emit an event matching the unique input, and include the full string given by the user
				e.emit(input, str);
				return true;
			}
		});

		//	If we reach the end of the loop and no match is found, tell the user to try again
		if (!matchFound) {
			console.log("Sorry, Try Again!");
		}
	}
};




//	Init script 
cli.init = () => {
	//	Send the message to the console, using Dark Blue
	console.log('\x1b[34m%s\x1b[0m',`The CLI Is Running!`);

	//	Start the interface
	var _interface = readline.createInterface({
		input: process.stdin,
		outpu: process.stdout,
		prompt: '>'
	});

	//	Create the prompt that the user will see
	_interface.prompt();

	//	Handle each line of input separately
	_interface.on('line', (str) => {
		//	Send to the input processor
		cli.processInput(str);

		//	Re-initialize the prompt afterward
		_interface.prompt();
	});

	//	If the user stops the CLI, kill that associated process
	_interface.on('close', () => {
		process.exit(0);
	});

};















//	Export the module
module.exports = cli;