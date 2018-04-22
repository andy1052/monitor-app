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
const os = require('os');
const v8 = require('v8');
class _events extends events{};
var e = new _events();


//	Instantiate the CLI module object
var cli = {};



//	Input Handlers (which will bind to events) (Not an object)
e.on('man', (str) => {
	cli.responders.help();
});

e.on('help', (str) => {
	cli.responders.help();
});

e.on('exit', (str) => {
	cli.responders.exit();
});

e.on('stats', (str) => {
	cli.responders.stats();
});

e.on('list users', (str) => {
	cli.responders.listUsers();
});

e.on('more user info', (str) => {
	//	This one require the string to be passed because "more user info --{userId}"
	cli.responders.moreUserInfo(str);
});

e.on('list checks', (str) => {
	//	This one also requires the string to be passed along
	cli.responders.listChecks(str);
});

e.on('more check info', (str) => {
	//	Again, pass the string
	cli.responders.moreCheckInfo(str);
});

e.on('list logs', (str) => {
	cli.responders.listLogs();
});

e.on('more log info', (str) => {
	//	Pass the string
	cli.responders.moreLogInfo(str);
});










//	Responders to input Handlers (REsponders object)
cli.responders = {};

	// Help/Man responder
	cli.responders.help = () => {
		var commands = {
			"man": "Show this help page",
			"help": "Alias of the 'man' command",
			"exit": "Kill the CLI and the rest of the application",
			"stats": "Get statistics on the underlying operating system and resource utilization",
			"list users": "Show a list of all the registered (undeleted) users in the system",
			"more user info --{userId}": "Show details of a specific user",
			"list checks --up --down": "Show a list of all the active checks in the system, including their state. The '--up' and '--down' flags are both optional",
			"more check info --{checkId}": "Show details of a specified check",
			"list logs": "Show a list of all the log files available to be read (compressed and uncompressed)",
			"more log info --{fileName}": "Show details of a specified log file"
		};
		//	Show a header for the help page that is as wide as the screen
		cli.horizontalLine();
		cli.centered('CLI MANUAL');
		cli.horizontalLine();
		cli.verticalSpace(2);

		//	Show each command, followed by its explanation in white and yellow respectively
		for (var key in commands) {
			if (commands.hasOwnProperty(key)) {
				var value = commands[key];
				var line = '\x1b[33m' + key + '\x1b[0m';
				var padding = 60 - line.length;

				for (let i = 0; i < padding; i +=1) {
					line += ' ';
				}
				line += value;
				console.log(line);
				cli.verticalSpace();
			}
		}

		cli.verticalSpace(1);
		cli.horizontalLine();
	};


// ************************** THESE ARE THE FUNCTION DEFINITIONS USED ABOVE (cli.horizontalLine(), etc...) ******************************

// Create a vertical space
cli.verticalSpace = function(lines){
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
      console.log('');
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = function(){

  // Get the available screen size
  var width = process.stdout.columns;

  // Put in enough dashes to go across the screen
  var line = '';
  for (i = 0; i < width; i++) {
      line+='-';
  }
  console.log(line);


};

// Create centered text on the screen
cli.centered = function(str){
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding there should be
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spaces before the string itself
  var line = '';
  for (i = 0; i < leftPadding; i++) {
      line+=' ';
  }
  line+= str;
  console.log(line);
};

//	************************************************************************************************************



	//	Exit
	cli.responders.exit = () => {
		process.exit(0);
	};

	//	Stats
	cli.responders.stats = () => {
		//	Compile an object of stats
		var stats = {
			"Load Average" : os.loadavg().join(' '),
			"CPU Count" : os.cpus().length,
			"Free Memory" : os.freemem(),
			"Current Malloced Memory" : v8.getHeapStatistics().malloced_memory,
			"Peak Malloced Memory" : v8.getHeapStatistics().peak_malloced_memory,
			"Allocated Heap Used (%)" : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
			"Avaliable Heap Allocated ()" : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
			"Uptime" : os.uptime() + 'Seconds'
		};

		//	Create a header the same as the help/man page but for stats
		cli.horizontalLine();
		cli.centered('SYSTEM STATISTICS');
		cli.horizontalLine();
		cli.verticalSpace(2);

		//	Log out each stat
		for (var key in stats) {
			if (stats.hasOwnProperty(key)) {
				var value = stats[key];
				var line = '\x1b[33m' + key + '\x1b[0m';
				var padding = 60 - line.length;

				for (let i = 0; i < padding; i +=1) {
					line += ' ';
				}
				line += value;
				console.log(line);
				cli.verticalSpace();
			}
		}

		cli.verticalSpace(1);
		cli.horizontalLine();

	};






	//	List users
	cli.responders.listUsers = () => {
		console.log("You asked to list the users!");
	};

	//	More user info
	cli.responders.moreUserInfo = (str) => {
		console.log(`You asked for more user info on ${str}`);
	};

	//	List checks
	cli.responders.listChecks = (str) => {
		console.log(`You asked to list checks ${str}`);
	};

	//	More check info
	cli.responders.moreCheckInfo = (str) => {
		console.log(`You asked for more check info: ${str}`);
	};

	//	List logs
	cli.responders.listLogs = () => {
		console.log(`You asked to list logs`);
	};

	//	More logs infor
	cli.responders.moreLogInfo = (str) => {
		console.log(`You asked for more logs info on ${str}`);
	};





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