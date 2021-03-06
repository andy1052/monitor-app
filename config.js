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
	"hashingSecret": "this is a secret"
};

environments.production = {
	"httpPort" : 5000,
	"httpsPort" : 5001,
	"envName" : 'production',
	"hashingSecret": "this is also a secret"
};

//	Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : {};

//	Check that the actual environment is one of the objects defined at the top of this file
//	If not, default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;

//	Export the module

module.exports = environmentToExport;
