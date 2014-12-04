//required modules
var express = require("express");
var router = express.Router();
var fs = require("fs");
var session = require("express-session");
var cookieParser = require("cookie-parser");


//cookie-parser middleware to store session to cookie
router.use(cookieParser("asdf"));

//setting options for session middleware
router.use(session({
	secret : "asdf", 
	resave: false,
    saveUninitialized: false
}));

//route for downloading pdf file
router.get("/downloadfile", function(request, response){

	//storing the converted pdf name
	var pdf_name = request.session.pdf_name;

	//stroring the username
	var username = request.session.username;

	//if there is no session username redirects to login
	if(!username)
		response.redirect("/")
	else{
		//storing the user's folder path
		var filepath = "./public/files/" + username + "/";

		//downloading converted file and using callback to check for errors
	 	response.download(filepath + pdf_name + ".pdf", function(error){
	 		if(error){
	 			response.send("There was an error occured during downloading file");
	 		}

	 	});

	}
	

});


module.exports = router;