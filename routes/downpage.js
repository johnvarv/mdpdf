//required modules
var express = require("express");
var router = express.Router();
var fs = require("fs");
var https = require("https");
var bodyParser = require("body-parser");
var markdownpdf = require("markdown-pdf");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var session = require("express-session");

//variables
//given URL
var repoURL = '';
//https response data
var fileData = '';
//logged in username
var username;

//https request header
var myheader = {	'User-Agent' : 'johnvarv',
					'Accept' : 'application/vnd.github.v3.raw'				
};

//cookie-parser middleware to store session to cookie
router.use(cookieParser("asdf"));

//setting options for session middleware
router.use(session({
	secret : "asdf", 
	resave: false,
    saveUninitialized: false
}));

//accessing route with get
router.get("/downpage", function(request, response){

	//storing session username
	username = request.session.username;

	//if session username does not exist then redirects to login
	if(!username)
		response.redirect("/")

	//if exists redirecting to index
	else
		response.redirect("/index")
})

//downpage route
router.post("/downpage", function(request, response){

	//storing username
	username = request.session.username;

	//storing given URL to variable
	repoURL = request.body.myurl;

	//checking if URL ends with "/"
	if(repoURL.substr(repoURL.length - 1) == '/'){
		repoURL = repoURL.substring(0, repoURL.length - 1);
	}

	//triming URL
	repoURL = repoURL.replace("https://github.com/", "");
	

	//define https request options
	var options = {
		host: 'api.github.com',
		path: '/repos/' + repoURL + '/readme',
		method: 'GET',
		headers: myheader
	};

	//naming the pdf file after the github user and the repository name
	var pdf_name = repoURL.replace("/", "_");

	//eliminating '.' character of pdf file name
	if (pdf_name.indexOf(".") > -1){
		pdf_name = pdf_name.replace(".", "")
	}

	//storing pdf file name in session variable
	request.session.pdf_name = pdf_name;

	//flag for already converted file
	var file_exists = fs.existsSync("public/files/" + username + "/" + pdf_name + ".pdf")

	//reading user file directory
	var user_files = fs.readdirSync("public/files/" + username);

	//if file to be converted already exists, user is redirected to history page 
	if(file_exists){

		//rendering the userhistory html if file to be convert already exists. passing required locals for user file list
		response.render("userhistory", {username: username, msg:"File Already exists", files: user_files})
	}

	else{

		//the request starts
		var https_request = https.request(options, function(https_response){
			
			console.log("Sending request for repository: " + repoURL);

			//checking if repository really exists
			if(https_response.statusCode == 200){

				//adding response data chunks on fileData String
				https_response.on('data', function(chunk) {
					fileData += chunk;
					console.log("data writing");
				});

				//at the end of the response
				https_response.on('end', function(){

					//writing fileData synchronously on temp file
					fs.writeFileSync("public/files/temp.md", fileData); 
					
					//converting temp.md. passing runnings path to add footer in created pdf
					fs.createReadStream("public/files/temp.md")
		  			.pipe(markdownpdf({ runningsPath: __dirname + '/runnings.js'}))
		  			.pipe(fs.createWriteStream("public/files/" + username  + "/" + pdf_name + ".pdf"));
		  			
		  			//empting fileData string and deleting temp.md
		  			fileData='';
		  			fs.unlinkSync("public/files/temp.md");
		  			
		  			console.log("Creating PDF file");

		  			//rendering downpage.html
					response.render("downpage");
				});
					
			}
			//https response returns error status code
			else{
				response.render("index",{username: username, msg: "Invalid Github repository URL or not existed README.md"});
				
			}
		
		});
			
		//end of https request
		https_request.end();	
	}

//end of downpage route	
});



module.exports = router;
