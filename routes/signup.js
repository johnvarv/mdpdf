//required modules
var express = require("express");
var router = express.Router();

//route for signup.html
router.get("/signup", function(request, response){
	response.render("signup", {error_msg : ""});
});


module.exports = router;