//required modules
var express = require("express");
var router = express.Router();
var fs = require("fs");
var session = require("express-session");
var cookieParser = require('cookie-parser');

//variables
//user's files array
var user_files = new Array();

//cookie-parser middleware to store session to cookie
router.use(cookieParser("asdf"));

//setting options for session middleware
router.use(session({
	secret : "asdf", 
	resave: false,
    saveUninitialized: false
}));

//access route using get
router.get("/userdldel", function(request, response){
	var username = request.session.username;

	//if user tries to access userdldel route and he's not logged in, is redirected in login.html
	if(!username)
		response.redirect("/");
});

//user download, delete and delete all files route
router.post("/userdldel", function(request, response){

	//storing the session username
	var username = request.session.username;

	//storing the path of the user's folder
	var folderpath = "./public/files/" + username + "/";

	//storing the selected file name from dropdown menu in userhistory.html
	var filename = request.body.fileslist;	

	//user clicked on Download file button
	if(request.body.fdownload){

		//getting user file list to pass it as locals rednering userhistory
		var user_files = fs.readdirSync("public/files/" + username);

		//donwloading selected file
		response.download(folderpath + filename, function(error){
			//checking if files exist to download
	 		if(!filename)
	 			response.render("userhistory", {username: username, msg: "There is no file converted. Hit Convert to start!", files: user_files});
	 	});

	}

	//user clicked on delete file button
	else if(request.body.fdelete){

		//checks if file to be deleted exists
		if(!filename)
			response.render("userhistory", {username: username, msg: "There is no file to delete", files: ""});
		
		else{
			//deleting selected file
			fs.unlinkSync(folderpath + filename);

			//geting the renewed file list array and its length to be passed in rendering userhistory locals
			var user_files = fs.readdirSync("public/files/" + username);

	 		//rendering userhistory.html
			response.render("userhistory", {username: username, msg: "File Deleted", files: user_files});

			console.log("User:", username,"- File:", filename, "deleted");
		}
	}

	//user clicked on delete all files button
	else{
		//getting user's file list array
		var user_files = fs.readdirSync("public/files/" + username);

		//loop to delete all user's files
		for(i = 0; i < user_files.length; i++)
			fs.unlinkSync(folderpath + user_files[i]);

		//geting the renewed file list array(always empty) be passed in rendering userhistory locals
		var user_files1 = fs.readdirSync("public/files/" + username);

		//rendering userhistory.html
		response.render("userhistory", {username: username, msg: "All files deleted", files: user_files1});

		console.log("User:", username, "- All files deleted");	
	}
	
});


module.exports = router;