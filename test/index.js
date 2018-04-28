/*
*
*	This is the test runner
*
*
*/



//	Application logic for the test runner
_app = {};




//	Container for the test
_app.tests =  {};


//	Add on the unit tests 
_app.tests.unit = require('./unit');






//	Count all tests
_app.countTests = function() {
	var counter = 0;
	for (var key in _app.tests) {
		if (_app.tests.hasOwnProperty(key)) {
			var subTests = _app.tests[key];
			for (var testName in subTests) {
				if (subTests.hasOwnProperty(testName)) {
					counter++;
				}
			}
		}
	}
	return counter;
};



//	Run all the tests, colection the errors and successes
_app.runTests = function() {
	var errors = [];
	var successes = 0;
	var limit = _app.countTests();
	var counter = 0;
	for (var key in _app.tests) {
		if (_app.tests.hasOwnProperty(key)) {
			var subTests = _app.tests[key];
			for (var testName in subTests) {
				if (subTests.hasOwnProperty(testName)) {
					(function(){
						var temTestName = testName;
						var testValue = subTests[testName];
						//	Call the test
						try {
							testValue(function() {
								//	If it calls back without throwing, then it succeeded, so log it in green
								console.log('\x1b[32m%s\x1b[0m', temTestName);
								counter++;
								successes++;
								if (counter == limit) {
									_app.produceTestReport(limit, successes, errors);
								}
							});
						} catch(e) {
							//	If ti throws, then it failed, so catch the error and log it in red
							errors.push({
								"name": testName,
								"error": e
							});
							console.log('\x1b[31m%s\x1b[0m', temTestName);
							counter++;
							if (counter == limit) {
								_app.produceTestReport(limit, successes, errors);
							}
						}
					})();
				}
			}
		}
	}
};



//	Produce a test report
_app.produceTestReport = function(limit, successes, errors) {
	console.log('');
	console.log("--------------------------BEGIN TEST REPORT-------------------------");
	console.log("");
	console.log("Total Tests: " + limit);
	console.log("Pass: ", successes);
	console.log("Fail: ", errors.length);
	console.log("");

	//	If there are errors, print them in detail
	if (errors.length > 0 ) {

	console.log("--------------------------BEGIN TEST REPORT-------------------------");
	console.log("");

	errors.forEach(function(testError) {
		console.log('\x1b[31m%s\x1b[0m', testError.name);
		console.log(testError.error);
	});

	console.log("");
	console.log("--------------------------END TEST REPORT-------------------------");




	}
	console.log("");
	console.log("-------------------------END TEST REPORT---------------------------");


};



//	Run the tests
_app.runTests();







