
/*
*
*	This is the unit tests
*
*/


//	Dependencies
const helpers = require('./../lib/helpers');
const assert = require('assert');
const logs = require('./../lib/logs');
const exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem');



//	Container for the tests
var unit = {};




//	Assert that the getNumber function is returning 1
unit['helpers.getNumber should return 1'] = function(done) {
	var val = helpers.getNumber();
	assert.equal(typeof(val), 'number');
	done();
};


//	Assert that the getNumber function is returning a number
unit['helpers.getNumber should return a number'] = function(done) {
	var val = helpers.getNumber();
	assert.equal(val, 1);
	done();
};


//	Assert that the getNumber function is returning a 2
unit['helpers.getNumber should return a 2'] = function(done) {
	var val = helpers.getNumber();
	assert.equal(val, 2);
	done();
};


//	Log.list should callback an array and a false error
unit['logs.list should callback a false error and an array of log names'] = function(done) {
	logs.list(true, function(err, logFileNames) {
		assert.equal(err,false);
		assert.ok(logFileNames instanceof Array);
		assert.ok(logFileNames.length > 1);
		done();
	});
};


//	Truncate should not throw even if the id does not exist
unit['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = function(done) {
	assert.doesNotThrow(function() {
		logs.truncate('I do not exist', function(err) {
			assert.ok(err);
					done();
		});
	}, TypeError);
};


//	ExampleDebbuginProblem.init should not throw (but it does)
unit['exampleDebuggingProblem.init should not throw when called'] = function(done) {
	assert.doesNotThrow(function() {
		exampleDebuggingProblem.init();
		done();
	}, TypeError);
};








//	Export module tests to the runner (test/index.js)
module.exports = unit;

