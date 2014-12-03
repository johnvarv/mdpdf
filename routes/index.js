//required modules
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var users = require("../models/users");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var crypto = require("crypto");

//variables for password encryption
var length = 64;
var iterations = 12000;
var username;
//cookie-parser middleware to store session to cookie
router.use(cookieParser("asdf"));

//setting options for session middleware
router.use(session({
	secret : "asdf", 
	resave: false,
    saveUninitialized: false
}));

//accessing route with get
router.get("/index", function(request, response){
	var username = request.session.username;

	//if session username does not exist then redirects to login
	if(!username)
		response.redirect("/");
	//if exists redirecting to index
	else{
		response.render("index", {username: username, msg: ""});
	}
});

//index route
router.post("/index", function(request, response){
	
	//defining given username and password
	username = request.body.username;
	var password = request.body.password;
	var encrypted_pass;

	//searching db for given username
	users.findOne({username: username}, function(err, user) {

		if(!user)
			response.render("login", {reg_msg : "", login_msg : "Username Not Found"});
		//storing the user salt
		var salt = user.salt;

		//creating the encrypted pass once again with the given user salt,same length and iterations
		encrypted_pass = crypto.pbkdf2Sync(password, salt, iterations, length);

		//transforming encrypted user password to hexademical String
		encrypted_pass = encrypted_pass.toString("hex");

		//comparing the encrypted password
		users.findOne({password: encrypted_pass}, function(err, user) {

			if(!user){
			response.render("login", {reg_msg : "", login_msg : "Password Incorect. Please try again"});
			}
			else{
				//storing and saving username to session variable username	
				request.session.username = username;
				request.session.save(function(error){}); 
				response.render("index", {username: username, msg: ""});
			}
		
		});
	
 	});

	
});

module.exports = router;
