//required modules
var express = require("express");
var router = express.Router();

//initial route
router.get("/", function(request, response){
	response.render("login", {login_msg : "", reg_msg : ""});
});


module.exports = router;