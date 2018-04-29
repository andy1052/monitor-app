/*
*
*	Async Hooks Example
*
*/


//	Dependencies
const async_hooks = require('async_hooks');
const fs = require('fs');

//	Target execution context
var targetExecutionContext = false;

//	Wrtie an arbitrary async function
var whatTimeIsIt = function(callback) {
	setInterval(function() {
		fs.writeSync(1, 'When the set interval runs the execution context is ' + async_hooks.executionAsyncId() + '\n');
		callback(Date.now());
	}, 1000);
};

//	Call that function
whatTimeIsIt(function(time) {
	fs.writeSync(1, "The time is " + time + '\n');
});


//	Define the async hooks
var hooks = {
	init(asyncId, type, triggerAsyncId, resource) {
		fs.writeSync(1, "Hook init " + asyncId + '\n');
	},
	before(asyncId) {
		fs.writeSync(1, "Hook before " + asyncId + '\n');
	},
	after(asyncId) {
	fs.writeSync(1, "Hook after " + asyncId + '\n');
	},
	destroy(asyncId) {
	fs.writeSync(1, "Hook destroy " + asyncId + '\n');
	},
	promiseResolve(asyncId) {
	fs.writeSync(1, "Hook promiseResolve " + asyncId + '\n');
	}
};



//	Create a new Asynchronous instance
var asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();













