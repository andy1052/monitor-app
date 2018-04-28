/*
*
*	API Tests
*
*/


//	Dependencies
const app = require('./../index');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config');


//	Create a container
const api = {};


//	Helper to craft http requests so they don't need to be rewritten every time
var helpers = {};
helpers.makeGetRequest = function(path, callback) {
	//	Confirgure the request details
	var requestDetails = {
		"protocol": "http:",
		"hostname": "localhost",
		"port": config.httpPort,
		"method": "GET",
		"path": path,
		"headers": {
			"Content-Type": "application/json"
		}
	};

	//	Send the request
	var req = http.request(requestDetails, function(res) {
		callback(res);
	});
	req.end();
};


//	The main init function should be able to run without throwing
api['app.init should start without throwing'] = function(done) {
	assert.doesNotThrow(function() {
		app.init((err) => {
			done();
		});
	}, TypeError);
};


//	Make a request to Ping
api['/ping should respond to GET with 200'] = function(done) {
	helpers.makeGetRequest('/ping', (res) => {
		assert.equal(res.statusCode, 200);
		done();
	});
};


//	Make request to api/users
api['/api/users should respond to GET with 400'] = function(done) {
	helpers.makeGetRequest('/api/users', (res) => {
		assert.equal(res.statusCode, 400);
		done();
	});
};


//	Make a request to a random path
api['A random path should respond to GET with 404'] = function(done) {
	helpers.makeGetRequest('/this/path/should/not/exist', (res) => {
		assert.equal(res.statusCode, 404);
		done();
	});
};








// Export the test to the runner
module.exports = api;