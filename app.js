//required modules
var fs = require("fs");
var express = require("express");
var https = require("https");
var bodyParser = require("body-parser");
var markdownpdf = require("markdown-pdf")
var path = require("path");

//defining express app
var app = express();

//defining routes
var downpage = require("./routes/downpage");
var downloadfile = require("./routes/downloadfile");
var index = require("./routes/index");

console.log("Starting");

//setting html view engine and .html files default folder
app.engine("html", require("ejs").renderFile);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

//using body-parser middleware for parsing JSON response from posting the form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//define path of static files
app.use(express.static(__dirname + "/public"));

//getting index.html
app.get("/", index);

//posting donwpage.html
app.post("/downpage", downpage);

//route for downloading document.pdf
app.get("/downloadfile", downloadfile);

//defining listening port for the web server
app.listen(80);
