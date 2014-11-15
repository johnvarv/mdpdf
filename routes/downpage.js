//required modules
var fs = require("fs");
var express = require("express");
var https = require("https");
var bodyParser = require("body-parser");
var markdownpdf = require("markdown-pdf")
var router = express.Router();

//variables
//given URL
var repoURL = '';
//https response data
var fileData = '';

//https request header
var myheader = {	'User-Agent' : 'johnvarv',
					'Accept' : 'application/vnd.github.v3.raw'				
};


//using body-parser middleware for parsing JSON response from posting the form
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));


router.post("/downpage", function(request, postresponse){

	//storing given URL to variable
	repoURL = request.body.myurl;

		//checking if URL ends with "/"
		if(repoURL.substr(repoURL.length - 1) == '/'){
			repoURL = repoURL.substring(0, repoURL.length - 1);
		}

		//triming URL
		repoURL = repoURL.replace("https://github.com/", "");
		console.log("Sending request for repository: " + repoURL);

		//define https request options
		var options = {
			host: 'api.github.com',
			path: '/repos/' + repoURL + '/readme',
			method: 'GET',
			headers: myheader
		};

		
		//the request starts
		var request = https.request(options, function(response){

			//checking if repository really exists
			if(response.statusCode == 200){

			//adding response data chunks on fileData String
				response.on('data', function(chunk) {
					fileData += chunk;
					console.log("data writing");
				});
		
				//at the end of the response
				response.on('end', function(){

					//writing fileData synchronously on temp file
					fs.writeFileSync("public/files/temp.md", fileData); 

					//converting temp.md
					fs.createReadStream("public/files/temp.md")
		  			.pipe(markdownpdf())
		  			.pipe(fs.createWriteStream("public/files/document.pdf"));
		  			
		  			//deleting temp.md and empting fileData string
		  			fileData='';
		  			fs.unlinkSync("public/files/temp.md");
		  			
		  			console.log("Creating PDF file");

		  			//rendenring downpage.html
					postresponse.render("downpage");
				});
					
			}
			//https response returns error status code
			else{
				postresponse.send("Invalid Github Repository URL");
			}
		});
		
		//end of https request
		request.end();	
});



module.exports = router;