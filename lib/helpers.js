/*
*
* Helpers for various tasks
*
*/

//	Dependencies
const crypto = require('crypto');
const config = require('./config');


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









//	Export Helpers
module.exports = helpers;