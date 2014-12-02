//required modules
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var users = require("../models/users");
var fs = require("fs");
var crypto = require("crypto");


//variables for password encryption
var length = 64;
var iterations = 12000;

//route to create user and password
router.post("/created", function(request, response){

	//defining the given username and password
	var username = request.body.username;
	var password = request.body.password;

	//creating salt for encryption with given length
	var salt = crypto.randomBytes(length);

	//converting salt to hexademical String
	salt = salt.toString('hex');  

	//storing encrypted password
	var encrypted_pass = crypto.pbkdf2Sync(password, salt, iterations, length);
	var encrypted_pass = encrypted_pass.toString("hex");
	
	//checks if given username already exists
	users.findOne({ username: username}, function(err, user) {
		if(user){
			//error message for already taken username
			response.render("signup", {error_msg : "Username already exists"});
		}
		else{

			//creating a new user with the given from the user attributes
			var myuser = new users({username: username, password: encrypted_pass, salt: salt});

			//saves user in database. checks for errors
			myuser.save(function(err) {
    			if (err) throw err;
			});

			//creating user folder
			fs.mkdirSync("./public/files/" + username);

			//rendering login file with succefull registration msg
			response.render("login", {login_msg : "", reg_msg : "You are successfully registered."});
		}
	});

});


module.exports = router;