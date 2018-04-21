	/*
	*
	*	These are the request handlers
	*
	*/


	// Dependencies
	const _data = require('./data');
	const helpers = require('./helpers');
	const config = require('./config');



	//	Define handlers
	var handlers = {};

	/*
	*
	*	Everything below this point is dedicated to HTML Handlers
	*
	*/

	//	INDEX Handler

	handlers.index = function(data, callback) {
		//	Reject any request that isn't a get
		if (data.method == 'get') {

			//	Prepare data for interpolation
			var templateData = {
				"head.title": "Uptime Monitoring - Made Simple",
				"head.description": "We offer free simple uptime monitoring for http, https sites of all kinds. When your site goes down, we'll send you a text to let you know",
				"body.class": "index"
			};
	//	Read in the index template as a string
			helpers.getTemplate('index', templateData, function(err, str) {
				if (!err && str) {
					//	Add the universal header and footer
					helpers.addUniversalTemplates(str, templateData, function(err, str) {
						if (!err && str) {
							//	Return that page as html
							callback(200, str, 'html');
						} else {
							callback(500, undefined, 'html');
						}
					});
				} else {
					callback(500, undefined, 'html');
				}
			});
		} else {
			callback(405, undefined, 'html');
		}
	};

// Create Account
handlers.accountCreate = function(data, callback) {
			//	Reject any request that isn't a get
		if (data.method == 'get') {

			//	Prepare data for interpolation
			var templateData = {
				"head.title": "Create an account",
				"head.description": "Signup is easy and only takes a few seconds",
				"body.class": "accountCreate"
			};
	//	Read in the index template as a string
			helpers.getTemplate('accountCreate', templateData, function(err, str) {
				if (!err && str) {
					//	Add the universal header and footer
					helpers.addUniversalTemplates(str, templateData, function(err, str) {
						if (!err && str) {
							//	Return that page as html
							callback(200, str, 'html');
						} else {
							callback(500, undefined, 'html');
						}
					});
				} else {
					callback(500, undefined, 'html');
				}
			});
		} else {
			callback(405, undefined, 'html');
		}
	};


//	Session Create
handlers.sessionCreate = function(data, callback) {
			//	Reject any request that isn't a get
		if (data.method == 'get') {

			//	Prepare data for interpolation
			var templateData = {
				"head.title": "Login to your account",
				"head.description": "Please enter your phone number and password to access your account",
				"body.class": "sessionCreate"
			};
	//	Read in the index template as a string
			helpers.getTemplate('sessionCreate', templateData, function(err, str) {
				if (!err && str) {
					//	Add the universal header and footer
					helpers.addUniversalTemplates(str, templateData, function(err, str) {
						if (!err && str) {
							//	Return that page as html
							callback(200, str, 'html');
						} else {
							callback(500, undefined, 'html');
						}
					});
				} else {
					callback(500, undefined, 'html');
				}
			});
		} else {
			callback(405, undefined, 'html');
		}
	};


//	Session has been deleted(logout)
handlers.sessionDeleted = function(data, callback) {
			//	Reject any request that isn't a get
		if (data.method == 'get') {

			//	Prepare data for interpolation
			var templateData = {
				"head.title": "Logged out",
				"head.description": "You have been logged out of your account",
				"body.class": "sessionDeleted"
			};
	//	Read in the index template as a string
			helpers.getTemplate('sessionDeleted', templateData, function(err, str) {
				if (!err && str) {
					//	Add the universal header and footer
					helpers.addUniversalTemplates(str, templateData, function(err, str) {
						if (!err && str) {
							//	Return that page as html
							callback(200, str, 'html');
						} else {
							callback(500, undefined, 'html');
						}
					});
				} else {
					callback(500, undefined, 'html');
				}
			});
		} else {
			callback(405, undefined, 'html');
		}
	};






//	Favicon Handler
handlers.favicon = function(data, callback) {
		//	Reject any request that isn't a get
		if (data.method == 'get') {
			//	Read in the favicon's data
			helpers.getStaticAsset('favicon.ico', function(err, data) {
				if (!err && data) {
					callback(200, data, 'favicon');
				} else {
					callback(500);
				}
			});
		} else {
			callback(405);
		}	
	};


//	For public assets
handlers.public = function(data, callback) {
		//	Reject any request that isn't a get
		if (data.method == 'get') {
			//	Get the file name being requested
			var trimmedAssetName = data.trimmedPath.replace('public', '').trim();
			if (trimmedAssetName.length > 0) {
				//	Read in the asset's data
				helpers.getStaticAsset(trimmedAssetName, function(err, data) {
					if (!err && data) {
						//	Determine the content type and (default to plain text)
						var contentType = 'plain';

						if (trimmedAssetName.indexOf('.css') > -1) {
							contentType = 'css';
						} 
						if (trimmedAssetName.indexOf('.png') > -1) {
							contentType = 'png';
						} 
						if (trimmedAssetName.indexOf('.jpg') > -1) {
							contentType = 'jpg';
						} 
						if (trimmedAssetName.indexOf('.ico') > -1) {
							contentType = 'favicon';
						} 

						//	Callback the data
						callback(200, data, contentType);
					} else {
						callback(404);
					}
				});
			} else {
				callback(404);
			}

		} else {
			callback(405);
		}
	};



	/*
	*
	* 	Everything below this point is dedicated to JSON Handlers (Backend)
	*
	*/


	// ****************** USERS - BLANKET HANDLER TO CHECK AGAINST METHODS *********************
	handlers.users = (data, callback) => {
		var acceptableMethods = ['post', 'get', 'put', 'delete'];
		if (acceptableMethods.indexOf(data.method) > -1) {
			handlers._users[data.method](data, callback);
		} else {
			callback(405);
		}
	};

	//	Container for Users sub-methods. I.E. define the post, get, put, delete allowed in handlers.users above
	handlers._users = {};

	//	************************* Users-post **************************

	//	Required data: firstName, lastName, phone, password, tosAgreement
	// Optional data: none;
	handlers._users.post = (data, callback) => {
		//	Check that all required fields are filled out
		var firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
		var lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
		var phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
		var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
		var tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? true : false;

		if (firstName && lastName && phone && password && tosAgreement) {
			//	Make sure that the user doesn't already exist by checking files directories first before creating new user
			_data.read('users', phone, function(err, data) {
				if (err) {
					// error here means that no user with this number already exists
					//	HAsh the password (crypto)
					var hashedPassword = helpers.hash(password);


					//	Create the user object
				if (hashedPassword) {
					var userObject = {
						"firstName" : firstName,
						"lastName" : lastName,
						"phone" : phone,
						"hashedPassword" : hashedPassword,
						"tosAgreement" : true
					};

					//	Store the user
					_data.create('users', phone, userObject, function(err) {
						if (!err) {
							callback(200);
						} else {
							console.log(err);
							callback(500, {"Error": "Could not create the new user"});
						}
					});
				} else {
					callback(500, {"Error": "Could not hash the password."});
				}

				} else {
					//	User already exists
					callback(400, {'Error': 'A User with that phone number already exists'});
				}
			});
		} else {
		callback(400, {'Error': 'Missing required fields'});
		}
	};

	//	******************** Users-get **************************

	//	Required data: phone
	//	Optinal data: none
	//	Only let authenticated users access their objects. Don't let them access anyone else's

	handlers._users.get = (data, callback) => {
		//	Check that the phone number provided is valid
		var phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
		if (phone) {
			//	Get the token from the headers
			var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

			//	Verify that the given token from the headers is valid for the phone number
			handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
				if (tokenIsValid) {
				//	Lookup the user
			_data.read('users', phone, function(err, data) {
				if (!err && data) {
					//	First remove the hashed password from the user object before returning it to the requester
					delete data.hashedPassword;
					callback(200, data);
				} else {
					callback(404);
				}
			});
				} else {
					callback(403, {"Error": "Missing required token in header or token is invalid"});
				}
			});
		} else {
			callback(400, {"Error": "Missing required field"});
		}

	};

	//	********************** Users-put **********************
	//	Required data: Phone
	//	Optional dataL firstName, lastName, and password
	//	At least one must be specified (Optional data)
	//	Only let an authenticated user update their own object, don't let them update anyone else's

	handlers._users.put = (data, callback) => {
		//	Check for the required field (same as get except not pulling from query string, pulling instead from payload)
		var phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;

		//	Check for the optional fields (Same as we did for post)
		var firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
		var lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
		var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

		//	Error if the phone (required field) is invalid
		if (phone) {
			//	Error if nothing is sent to update
			if (firstName || lastName || password) {
				//	Get the token from the headers
				var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

						//	Verify that the given token from the headers is valid for the phone number
			handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
				if (tokenIsValid) {
						//	Lookup the user
				_data.read('users', phone, function(err, userData) {
					if (!err && userData) {
						//	Update the fields necessary
						if (firstName) {
							userData.firstName = firstName;
						}
						if (lastName) {
							userData.lastName = lastName;
						} 
						if (password) {
							userData.hashedPassword = helpers.hash(password);
						}
						//	Store the new data
						_data.update('users', phone, userData, function(err) {
							if (!err) {
								callback(200);
							} else {
								console.log(err);
								callback(500, {'Error': 'Could not update the user on server'});
							}
						});

					} else {
						callback(400, {"Error": "The specified user does not exit"});
					}
				});
				} else {
					callback(403, {"Error": "Missing required token in header or token is invalid"});
				}
			});
			} else {
				callback(400, {"Error": "Missing fields to update"});
			}

		} else {
			callback(400, {"Error": "Missing required field"});
		}

	};


	//	*************** Users-delete *************************
	//	Set up in similar way to get
	//	Required data: phone
	//	Only let an authenticated user delete their object, don't let them delete anyone else's
	//	Cleanup (delete) any other data files associated with this user (This is done after tokens and checks crud operations are completed)

	handlers._users.delete = (data, callback) => {
		//	Check that the phone number is valid
		var phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
		if (phone) {
				//	Get the token from the headers
				var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

				//	Verify that the given token from the headers is valid for the phone number
			handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
				if (tokenIsValid) {
				//	Lookup the user
					_data.read('users', phone, function(err, userData) {
				if (!err && userData) {
					_data.delete('users', phone, function(err) {
						if (!err) {
							//	This is where the "Cleanup command" comes in
							//	Delete each of the checks associated with the user
						var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
						var checksToDelete = userChecks.length;
						if (checksToDelete > 0) {
							var checksDeleted = 0;
							var deletionErrors = false;
							//	Loop through the checks
							userChecks.forEach(function(checkId) {
								_data.delete('checks', checkId, function(err){
									if (err) {
										deletionErrors = true;
									}
									checksDeleted++;
									if (checksDeleted === checksToDelete) {
										if (!deletionErrors) {
											callback(200);
										} else {
											callback(500, {"Error": "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully"});
										}
									}
								});
							});

						} else {
							callback(200)
						}
					} else {
							callback(500, {"Error": "Could not delete the specified user"});
						}
					});
				} else {
					callback(400, {"Error": "Could not find specified user"});
				}
			});
				} else {
					callback(403, {"Error": "Missing required token in header or token is invalid"});
				}
			});
		} else {
			callback(400, {"Error": "Missing required field"});
		}
	};





	//	*********** TOKENS - BLANKET HANDLER TO CHECK AGAINST METHODS ***************

	handlers.tokens = (data, callback) => {
		var acceptableMethods = ['post', 'get', 'put', 'delete'];
		if (acceptableMethods.indexOf(data.method) > -1) {
			handlers._tokens[data.method](data, callback);
		} else {
			callback(405);
		}
	};


	// Container for all the tokens methods

	handlers._tokens = {};


	// ************* Tokens - POST ************
	//	Required data: phone and password
	//	Optional data: none
	handlers._tokens.post = function(data, callback) {
		var phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
		var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
		if (phone && password) {
			//	Lookup the user who matches that phone number
			_data.read('users', phone, function(err, userData) {
				if (!err && userData) {
					//	Hash the sent password and compare it to the password stored in the user object
					var hashedPassword = helpers.hash(password);
					if (hashedPassword === userData.hashedPassword) {
						//	If valid, create a new token with a random name. Set expiration date 1 hour in the future
						var tokenId = helpers.createRandomString(20);
						var expires = Date.now() + 1000 * 60 * 60;
						var tokenObject = {
							'phone': phone,
							'id': tokenId,
							'expires': expires
						};

						//	Store the token
						_data.create('tokens', tokenId, tokenObject, (err) => {
							if (!err) {
								callback(200, tokenObject);
							} else {
								callback(500, {"Error": "Could not create the new token"});
							}
						});

					} else {
						callback(400, {"Error": "Password did not match the specified user's stored password"});
					}
				} else {
					callback(400, {"Error": "Could not find the specified user"});
				}
			});


		} else {
			callback(400, {"Error": "Missing required fields"});
		}
	};


	// ************* Tokens - GET *****************
	//	Required data: id
	//	Optional data: none
	handlers._tokens.get = function(data, callback) {
		//	Check that the id is valid 
		var id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
		if (id) {
			//	Lookup the token
			_data.read('tokens', id, function(err, tokenData) {
				if (!err && tokenData) {
					callback(200, tokenData);
				} else {
					callback(404);
				}
			});
		} else {
			callback(400, {"Error": "Missing required field"});
		}
	};




	// **************** Tokens - PUT ****************
	//	Required data: id and extend (there's nothing to send to a token except extending it's expiry date, the length of which will be controlled by the code)
	//	Optional data: none
	handlers._tokens.put = function(data, callback) {
		var id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
		var extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false;
		if (id && extend) {
			//	Lookup the token
			_data.read('tokens', id, (err, tokenData) => {
				if (!err && tokenData) {
					//	Check to make sure the token isn't expired
					if (tokenData.expires > Date.now()) {
						//	Set the expiration an hour from now
						tokenData.expires = Date.now() + 1000 * 60 * 60;

						//	Store the new updates
						_data.update('tokens', id, tokenData, function(err) {
							if (!err) {
								callback(200)
							} else {
								callback(500, {"Error": "Could not update the token's expiration"});
							}
						});

					} else {
						callback(400, {"Error": "The token has already expired and cannot be extended"});
					}
				} else {
					callback(400, {"Error": "Specified token does not exist"});
				}
			});
		} else {
			callback(400, {"Error": "Missing required fields or fields are invalid"});
		}

	};

	// ******************** Tokens - DELETE ******************
	//	Required data: id
	//	Optional data: none
	handlers._tokens.delete = function(data, callback) {
		//	Check that the id is valid
		var id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
		if (id) {
			//	Lookup the user
			_data.read('tokens', id, function(err, data) {
				if (!err && data) {
					_data.delete('tokens', id, function(err) {
						if (!err) {
							callback(200)
						} else {
							callback(500, {"Error": "Could not delete the specified token"});
						}
					});


				} else {
					callback(400, {"Error": "Could not find specified token"});
				}
			});
		} else {
			callback(400, {"Error": "Missing required field"});
		}
	};


	//	************ Verify if a given token id is currently valid for a given user *******
	handlers._tokens.verifyToken = (id, phone, callback) => {
		//	Lookup the token
		_data.read('tokens', id, (err, tokenData) => {
			if (!err && tokenData) {
				//	Check that the token is for the given user and has not expired
				if (tokenData.phone === phone && tokenData.expires > Date.now()) {
					callback(true);
				} else {
					callback(false);
				}
			} else {
				callback(false);
			}
		});
	};


	// ******************* CHECKS SERVICE ********************

	// ******************* CHECKS - BLANKET HANDLER TO CHECK AGAINST METHODS ***************

	handlers.checks = (data, callback) => {
		var acceptableMethods = ['post', 'get', 'put', 'delete'];
		if (acceptableMethods.indexOf(data.method) > -1) {
			handlers._checks[data.method](data, callback);
		} else {
			callback(405);
		}
	};


	// Container for all checks methods
	handlers._checks = {};

	//	******************** Checks - POST ********************
	//	Required data: protocol, url, method, successCodes, timeoutSeconds
	// Optional data: none
	handlers._checks.post = (data, callback) => {
		//	Validate all inputs
		var protocol = typeof(data.payload.protocol) === 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
		var url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
		var method = typeof(data.payload.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
		var successCodes = typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
		var timeoutSeconds = typeof(data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

		if (protocol && url && method && successCodes && timeoutSeconds) {
			//	Get the token from the headers
			var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

			//	Lookup userPhone by reading token
			_data.read('tokens', token, function(err, tokenData) {
				if (!err && tokenData) {
					//	Get user's phone number
					var userPhone = tokenData.phone;

					//	Lookup the user data
					_data.read('users', userPhone, function(err, userData) {
						if (!err && userData) {
							var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
							//	Verify that the user has less than the number of maxchecks per user (5)
							
							if (userChecks.length < config.maxChecks) {
								//	Create a random id for the check
								var checkId = helpers.createRandomString(20);

								//	Create the check object and include the user's phone, this is a no sql pattern
								var checkObject = {
									'id': checkId,
									'userPhone': userPhone,
									'protocol': protocol,
									'url': url,
									'method': method,
									'successCodes': successCodes,
									'timeoutSeconds': timeoutSeconds
								};

								//	Save the object (mkdir .data/checks first)
								_data.create('checks', checkId, checkObject, function(err) {
									if (!err) {
										//	Add the checkId to the user's object
										userData.checks = userChecks;
										userData.checks.push(checkId);

										//	Save the new user data
										_data.update('users', userPhone, userData, function(err) {
											if (!err) {
												//	Return the data about the new check
												callback(200, checkObject);
											} else {
												callback(500, {"Error": "Could not update the user with the new check"});
											}
										});

									} else {
										callback(500, {"Error": "Could not create the new check"});
									}
								});

							} else {
								callback(400, {"Error": `The user already has the maximum number of checks ${config.maxChecks}.`});
							}
					
						} else {
							callback(403);
						}
					});

				} else {
					callback(403);
				}
			});
		} else {
			callback(400, {"Error": "Missing required inputs or inputs are invalid"});
		}
	};



	//	*********************** CHECKS - GET ***************************
	//	Required data: id
	//	Optional data: none
	handlers._checks.get = (data, callback) => {
		//	Check that the id provided is valid
		var id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
		if (id) {
			//	Lookup the check
			_data.read('checks', id, (err, checkData) => {
				if (!err && checkData) {
			//	Get the token from the headers
			var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
			//	Verify that the given token from the headers is valid and belongs to the user who created the check
			handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
				if (tokenIsValid) {
				//	Return the check data
				callback(200, checkData);
				} else {
					callback(403);
				}
			});
			} else {
					callback(404);
				}
			});
		} else {
			callback(400, {"Error": "Missing required field"});
		}		
	};




	//	*********************** Checks - PUT ***************************
//	Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds (One must be sent)
handlers._checks.put = function(data, callback) {
	//	Validate id, the required field
		var id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
		//	Check for the optional fields (Same as we did for post)
		var protocol = typeof(data.payload.protocol) === 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
		var url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
		var method = typeof(data.payload.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
		var successCodes = typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
		var timeoutSeconds = typeof(data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
		// Make sure id is valid
		if (id) {
			//	Check to make sure one or more optional fields are included
			if (protocol || url || method || successCodes || timeoutSeconds) {
				//	Lookup the check
				_data.read('checks', id, function(err, checkData) {
					if (!err && checkData) {
					//	Get the token from the headers
					var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
					//	Verify that the given token from the headers is valid and belongs to the user who created the check
					handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
						if (tokenIsValid) {
							//	Update the check where necessary
							if (protocol) {
								checkData.protocol = protocol;
							}
							if (url) {
								checkData.url = url;
							}
							if (method) {
								checkData.method = method;
							}
							if (successCodes) {
								checkData.successCodes = successCodes;
							}
							if (timeoutSeconds) {
								checkData.timeoutSeconds = timeoutSeconds;
							}

							//	Store the updates
							_data.update('checks', id, checkData, function(err) {
								if (!err) {
									callback(200);
								} else {
									callback(500, {"Error": "Could not update the check"});
								}
							});

						} else {
							callback(403);
						}
					});
					} else {
						callback(400, {"Error": "Check id did not exist"});
					}
				});
			} else {
				callback(400, {"Error": "Missing fields to update"});
			}
		} else {
			callback(400, {"Error": "Missing required field"});
		}
	};




	//	*********************** CHECKS - DELETE *************************
//	Required data: id
//	Optional data: none
handlers._checks.delete = function(data, callback) {
			//	Check that the id is valid
		var id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
		if (id) {

			//	Lookup the check they want to delete
			_data.read('checks', id, function(err, checkData) {
				if (!err && checkData) {
				//	Get the token from the headers
				var token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

				//	Verify that the given token from the headers is valid for the phone number
			handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
				if (tokenIsValid) {
					//	Delete the check data
					_data.delete('checks', id, function(err) {
						if (!err) {
				//	Lookup the user
					_data.read('users', checkData.userPhone, function(err, userData) {
					if (!err && userData) {

						var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
						//	Remove the deleted check from their list of checks
						var checkPosition = userChecks.indexOf(id);

						if (checkPosition > -1) {
							userChecks.splice(checkPosition, 1);
							// Re-save the user's data
					_data.update('users', checkData.userPhone, userData, function(err) {
						if (!err) {
							callback(200)
						} else {
							callback(500, {"Error": "Could not update the user"});
						}
					});
						} else {
							callback(500, {"Error": "Could not find the check on the user's object"});
						}

				} else {
					callback(500, {"Error": "Could not remove the check from the list of checks on user object"});
				}
			});
			} else {
				callback(500, {"Error": "Could not delete the check data"});
				}
			});
		} else {
			callback(403);
			}
		});
	} else {
		callback(400, {"Error": "The specified check id does not exist"});
			}
		});
} else {
	callback(400, {"Error": "Missing required field"});
	}
};











	//	******* Ping handler *******
	handlers.ping = function(data, callback) {
		callback(200);
	};

	//	Not found handler
	handlers.notFound = function(data, callback) {
		callback(404);
	};








	//	Export the module
	module.exports = handlers;











