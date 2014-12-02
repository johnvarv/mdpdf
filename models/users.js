//required modules
var mongoose = require('mongoose');

//name of the db in localhost
mongoose.connect('mongodb://localhost/mdtopdf');

var db = mongoose.connection;

//success notification on open connection with db
db.once('open', function callback () {
  console.log("Database connection succefull");
});

//error with db connection
db.on('error', console.error.bind(console, 'connection error:'));

//Schema for users model
var users = mongoose.model("users", {
	username: String,
	password: String,
	salt: String
})

//export users model
module.exports = mongoose.model('users', users);