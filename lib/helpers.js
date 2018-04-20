/*
*
* Helpers for various tasks
*
*/

//	Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');


//	Container for all the helpers
var helpers = {};



//	Create a SHA256 hash
helpers.hash = function(str) {
	if (typeof(str) === 'string' && str.length > 0) {
		let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
};

//	Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
	try {
		var obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	}
};


//	Create a string of random alpha numeric characters of a given length
helpers.createRandomString = (strLength) => {
	strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
	if (strLength) {
		//	Define all the possible characters that could go into a string
		var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

		//	Start the final string
		var str = '';

		for (var i = 0; i < strLength; i += 1) {
			//	Get a random character from the possibleCharacters string
			var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
			//	Append this character to the final string
			str += randomCharacter;
		}
		//	Return the final string
		return str;

	} else {
		return false;
	}
}


//	Send an sms via Twilio
helpers.sendTwilioSms = function(phone, msg, callback) {
	//	Validate the parameters
	phone = typeof(phone) === 'string' && phone.trim().length === 10 ? phone.trim() : false;
	msg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
	if (phone && msg) {
		//	Configure the request payload to sent to Twilio
		var payload = {
			"From": config.twilio.fromPhone,
			"To": "+1" + phone,
			"Body": msg
		};

		//	Stringify the payload
		var stringPayload = querystring.stringify(payload);

		//	Configure the request details
		var requestDetails = {
			"protocol": "https:",
			"hostname": "api.twilio.com",
			"method": "POST",
			"path": "/2010-04-01/Accounts/"+config.twilio.accountSID+"/Messages.json",
			"auth": config.twilio.accountSID +":" +config.twilio.authToken,
			"headers": {
				"Content-Type": "application/x-www-form-urlencoded",
				"Content-Length": Buffer.byteLength(stringPayload)
			}
		};

		//	Instantiate the request object
		var req = https.request(requestDetails, (res) => {
			//	Grab the status of the sent request
			var status = res.statusCode;
			//	Callback successfully if request  went through
			if (status === 200 || status === 201) {
				callback(false);
			} else {
				callback(`Status code returned was ${status}`);
			}
		});

		//	Need to bind to an error event so it doesn't get thrown
		req.on('error', (e) => {
			callback(e);
		});

		//	Add the payload to the request
		req.write(stringPayload);

		//	End the request
		req.end();

	} else {
		callback(`Given parameters were missing or were invalid`);
	}
};



// ********************* HTML HELPERS FROM HERE DOWN ********************************************

//	Get the string content of a template
helpers.getTemplate = function(templateName, callback) {
	templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
	if (templateName) {
		var templatesDir = path.join(__dirname, '/../templates/');
		fs.readFile(templatesDir + templateName + '.html', 'utf-8', function(err, str) {
			if (!err && str && str.length > 0) {
				callback(false, str);
			} else {
				callback('No template could be found');
			}
		});
	} else {
		callback('A valid template name was not specified');
	}
};








//	Export Helpers
module.exports = helpers;