//required modules
var express = require("express");
var router = express.Router();
var session = require("express-session");
var cookieParser = require('cookie-parser');

//cookie-parser middleware to store session to cookie
router.use(cookieParser("asdf"));

//setting options for session middleware
router.use(session({
	secret : "asdf", 
	resave: false,
    saveUninitialized: false
}));

//destroying session and redirects to login.html
router.get("/logout", function(request, response){
	
	request.session.destroy(function(error){
		response.redirect("/");
	});
	
});


module.exports = router;