//required modules
var fs = require("fs");
var express = require("express");
var router = express.Router();
var filePath = "./public/files/document.pdf";



router.get("/downloadfile", function(require, response){
//using callback to check for errors and to 
//delete pdf file after user download it
 response.download(filePath, function(error){
 	if(error){
 		response.send("There was an error occured during downloading file");
 	} else {
 		fs.unlinkSync(filePath);
 	console.log("Deleting PDF file");
 	}
 	
 });
})


module.exports = router;