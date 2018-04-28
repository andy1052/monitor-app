/*
*
*	This is a library that demonstrates something throwing when it's init() is called
*
*/



//	Container for the module
var example = {};



//	Init function
example.init = function() {
	//	This is an error created intentionally (bar is not defined)/ reference error
	var foo = bar;
};








//	Export module
module.exports = example;