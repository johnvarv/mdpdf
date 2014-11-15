//required modules
var express = require("express");
var router = express.Router();

//index route
router.get("/", function(request, response){
	response.render("index");
});


module.exports = router;