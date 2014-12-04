//required modules
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var markdownpdf = require("markdown-pdf");
var mongoose = require('mongoose');
var session = require("express-session");
var cookieParser = require('cookie-parser');

//defining express app
var app = express();

//cookie-parser middleware to store session to cookie
app.use(cookieParser());

//setting options for session middleware
app.use(session({
	secret : "asdf", 
	resave: true,
    saveUninitialized: true
}));


//defining routes
var converted = require("./routes/converted");
var downloadfile = require("./routes/downloadfile");
var login = require("./routes/login");
var signup = require("./routes/signup");
var index = require("./routes/index");
var created = require("./routes/created");
var userhistory = require("./routes/userhistory");
var userdldel = require("./routes/userdldel");
var logout = require("./routes/logout");

console.log("Starting");

//setting html view engine and .html files default folder
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

//using body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//define path of static files
app.use(express.static(__dirname + "/public/css"));
app.use(express.static(__dirname + "/public"))

//All routes
//intitial route
app.use(login);

//user index page
app.use(index);

//rendering signup.html
app.use(signup);

//convert the pdf file
app.use(converted);

//downloading converted pdf
app.use(downloadfile);

//user history page
app.use(userhistory);

//user download, delete and delete all files route
app.use(userdldel);

//user and user folder created. password encrytion
app.use(created);

//user log out. destroying session.
app.use(logout);

//defining listening port for the web server
app.listen(3000);
