/*
* Create and export configuration variables
*/

//	Container for all the environments
var environments = {};

//	Create staging (default) environment
environments.staging = {
	"httpPort" : 3000,
	"httpsPort" : 3001,
	"envName" : "staging",
	"hashingSecret": "this is a secret",
	"maxChecks": 5,
	"twilio" : {
  	 	 "accountSid" : "ACb32d411ad7fe886aac54c665d25e5c5d",
   		 "authToken" : "9455e3eb3109edc12e3d8c92768f7a67",
  		  "fromPhone" : "+15005550006"
	}
};

environments.production = {
	"httpPort" : 5000,
	"httpsPort" : 5001,
	"envName" : 'production',
	"hashingSecret": "this is also a secret",
	"maxChecks": 10,
	"twilio" : {
		"accountSid": "",
		"authToken": "",
		"fromPhone": ""
	}
};

//	Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : {};

//	Check that the actual environment is one of the objects defined at the top of this file
//	If not, default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;

//	Export the module

module.exports = environmentToExport;
