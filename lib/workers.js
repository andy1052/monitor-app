/*
*	Worker related tasks
*/

//	Dependencies
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');
const _logs = require('./logs');


// Instatiated the workers object
var workers = {};


//	Lookup all checks, get their data, then send to a validator
workers.gatherAllChecks = function() {
	//	Get all the checks that exist in the function
	_data.list('checks', function(err, checks) {
		if (!err && checks && checks.length > 0) {
			checks.forEach((check) => {
				//	Read in the check data 
				_data.read('checks', check, (err, originalCheckData) => {
					if (!err && originalCheckData) {
						//	Pass the data to the check validator and let that function continue or log errors as needed
						workers.validateCheckData(originalCheckData);
					} else {
						console.log("Error: Reading one of the checks data");
					}
				});
			});
		} else {
			console.log("Error: Could not find any checks to process");
		}
	});
};


//	Sanity-checking the check data from gatherAllChecks
workers.validateCheckData = function(originalCheckData) {
	originalCheckData = typeof(originalCheckData) === 'object' && originalCheckData !== null ? originalCheckData : {};
	originalCheckData.id = typeof(originalCheckData.id) === 'string' && originalCheckData.id.trim().length === 20 ? originalCheckData.id.trim() : false;
	originalCheckData.userPhone = typeof(originalCheckData.userPhone) === 'string' && originalCheckData.userPhone.trim().length === 10 ? originalCheckData.userPhone.trim() : false;
	originalCheckData.protocol = typeof(originalCheckData.protocol) === 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol.trim() : false;
	originalCheckData.url = typeof(originalCheckData.url) === 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
	originalCheckData.method = typeof(originalCheckData.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) ? originalCheckData.method.trim() : false;
	originalCheckData.successCodes = typeof(originalCheckData.successCodes) === 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
	originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) === 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

	//	Set the keys that may not be set if the workers have never seen this check before
	originalCheckData.state = typeof(originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state.trim() : 'down';
	originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

	//	If all the checks pass, pass the data along to the next step in the process
	if (originalCheckData.id &&
		originalCheckData.userPhone &&
		originalCheckData.protocol &&
		originalCheckData.url && 
		originalCheckData.method && 
		originalCheckData.successCodes &&
		originalCheckData.timeoutSeconds) {

		workers.performCheck(originalCheckData);
	} else {
		console.log("Error: one of the checks is not properly formatted. Skipping it");
	}
};


//	Perform the check, send the original CheckData and outcome to the next check process
workers.performCheck = function(originalCheckData) {
	//	Prepare the initial check outcome
	var checkOutcome = {
		"error" : false,
		"responseCode" : false
	};

	//	Mark that the outcome has not been sent yet
	var outcomeSent = false;

	//	Parse the hostname and the path out of the originalCheckData
	var parsedUrl = url.parse(originalCheckData.protocol + "://" + originalCheckData.url, true);
	var hostname = parsedUrl.hostname;
	var path = parsedUrl.path; // Using path and not "pathname" because we want the query string

	//	Construct the request
	var requestDetails = {
		"protocol": originalCheckData.protocol + ":",
		"hostname": hostname,
		"method": originalCheckData.method.toUpperCase(),
		"path": path,
		"timeout": originalCheckData.timeoutSeconds * 1000
	};

	//	Init the request object using either the http or https module
	var _moduleToUse = originalCheckData.protocol === 'http' ? http : https;

	// Craft the request
	var req = _moduleToUse.request(requestDetails, function(res) {
		//	Grab the status of the sent request
		var status = res.statusCode;

		//Update the check outcome and pass the data along
		checkOutcome.responseCode = status;
		if (!outcomeSent) {
			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});

		//	Bind to the error event so it doesn't get thrown
		req.on('error', function(e) {
			//	Update the checkOutcome and pass the data along.
			checkOutcome.error = {
				'error': true,
				'value': e
			};

			if (!outcomeSent) {
			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		};
	});

		//	Bind to the timeout
		req.on('timeout', function(e) {
			//	Update the checkOutcome and pass the data along.
			checkOutcome.error = {
				'error': true,
				'value': 'timeout'
			};

			if (!outcomeSent) {
			workers.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		};
	});	

		//	End the request
		req.end();
};



//	Process the check outcome, update the check data as needed, and trigger an alert if needed
//	Special logic for accomodating a check that has never been tested before (don't alert on this one)
workers.processCheckOutcome = function(originalCheckData, checkOutcome) {
	//	Decide if the check is up or down in its current state
	var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? "up" : "down";

	//	Is an alert warranted?? (shoud an sms be sent)
	var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

	//	Log the outcome of the check
	var timeOfCheck = Date.now();
	workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

	//	Update the check data
	var newCheckData = originalCheckData;
	newCheckData.state = state;
	newCheckData.lastChecked = timeOfCheck;



	//	Save the update
	_data.update('checks', newCheckData.id, newCheckData, function(err) {
		if (!err) {
			//	Send the new check data to the next phase in the process if needed
			if (alertWarranted) {
				workers.alertUserToStatusChange(newCheckData);
			} else {	
				console.log("Check outcome has not changed, no alert needed");
			}
		} else {	
			console.log('Error trying to save updates to one of the checks');
		}
	});
};


//	Alert to user to a change in their check status
workers.alertUserToStatusChange = function(newCheckData) {
	var msg = 'Alert: Your check for ' + newCheckData.method.toUpperCase() + ' ' + newCheckData.protocol + '://' + newCheckData.url + ' is currently ' + newCheckData.state;
	helpers.sendTwilioSms(newCheckData.userPhone, msg, function(err) {
		if (!err) {
			console.log("Success! User was alerted to a status change in their check via SMS: ", msg);
		} else {
			console.log("Error: could not send sms alert to user with state change in their check");
		}
	});
};


//	Workers.log Function for logging outcome of checks
workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
		//	Form the log data
		var logData = {
			"check": originalCheckData,
			"outcome": checkOutcome,
			"state": state,
			"alert": alertWarranted,
			"time": timeOfCheck
		};

		//	Convert data to a string
		var logString = JSON.stringify(logData);

		//	Determine the name of the log file
		var logFileName = originalCheckData.id;

		//	Append the log string to the file we want to write to
		_logs.append(logFileName, logString, (err) => {
			if (!err) {
				console.log("Logging to file succeeded");
			} else {
				console.log("Logging to log failed");
			}
		});

	};




//	Timer to execute the worker process once per minute
workers.loop = function() {
	setInterval(function() {
		workers.gatherAllChecks();
	}, 1000 * 60);
};


//	Rotate aka(Compress) the log files
workers.rotateLogs = function() {
	//	List all the (now compressed) log files
	_logs.list(false, function(err, logs) {
		if (!err && logs.length > 0) {
			logs.forEach((logName) => {
				//	Compress the data to a different file
				var logId = logName.replace('.log', '');
				var newFileId = logId + '––' + Date.now();
				_logs.compress(logId, newFileId, (err) => {
					if (!err) {
						// Truncate the log
						_logs.truncate(logId, (err) => {
							if (!err) {
								console.log("Success truncating log file");
							} else {
								console.log("Error truncating log file");
							}
						});
					} else {
						console.log("Error compressing one of the log files: ", err)
					}
				});
			});
		} else {
			console.log("Error, Could not find any logs to rotate");
		}
	});
};


//	Timer to execute the log rotation process once per day
workers.logRotationLoop = function() {
	setInterval(function() {
		workers.rotateLogs();
	}, 1000 * 60 * 60 * 24);
};





//	Init script (for index.js)
workers.init = function() {
	//	Execute all the checks immediately
	workers.gatherAllChecks();
	//	Call the loop so the checks will execute later on with a setInterval
	workers.loop();
	//	Compress all the logs immediately upon init
	workers.rotateLogs();
	//	Call the compression loop so logs will be compressed later on
	workers. logRotationLoop();
};











// Export the module
module.exports = workers;