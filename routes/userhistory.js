//required modules
var fs = require("fs");
var express = require("express");
var router = express.Router();
var session = require("express-session");
var cookieParser = require('cookie-parser');

//variables
var user_files = new Array();

//cookie-parser middleware to store session to cookie
router.use(cookieParser("asdf"));

//setting options for session middleware
router.use(session({
	secret : "asdf", 
	resave: false,
    saveUninitialized: false
}));

//userhistory route
router.get("/userhistory", function(request, response){

	//storing the session username localy
 	var username = request.session.username;

 	if(!username)
 		response.redirect("/");

 	//reading the user's folder and storing it in user_files array
	user_files = fs.readdirSync("public/files/" + username);
	
	//rendering userhistory with locals the user's file list array
	response.render("userhistory.html", {username: username,  msg: "", files: user_files})
		
});


module.exports = router;