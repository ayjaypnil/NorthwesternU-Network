var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var ejs = require('ejs');
var mysql = require("mysql");
var app = express();



var PORT = process.env.PORT || 3000;

var connection = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "",
  database: "nw_db"
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs"); 

app.use(express.static("public"));






app.get("/", function(req, res) {
 res.render( __dirname + "/views/home.ejs");
});

app.get("/home", function(req, res) {
  res.render( __dirname + "/views/home.ejs");
});

app.get("/profile", function(req, res) {
  res.render( __dirname + "/views/profile.ejs");
});

app.get("/newevent", function(req, res) {
  res.render( __dirname + "/views/newevent.ejs");
});

app.get("/jobs", function(req, res) {
  res.render(__dirname + "/views/jobs.ejs");
});

app.get("/login", function(req, res) {
  res.render(__dirname + "/views/user/login.ejs");
});

app.get("/register", function(req, res) {
  res.render(__dirname + "/views/user/register.ejs");
});



connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);

  app.post('/create', function(req, res){
    var newMember = req.body;
    // console.log(newMember);
    var query = "INSERT INTO users (email, password_hash, first_name, last_name, campus, grad_date, site_link) VALUES (?, ?, ?, ?, ?, ?, ?)"
      connection.query(query, [req.body.email, req.body.password_hash, req.body.first_name, req.body.last_name, req.body.campus, req.body.grad_date, req.body.link], function(err, response){
          if (err) throw err;
      });
    });

  app.post('/createevent', function(req, res){
    var newEvent = req.body;
    // console.log(newMember);
    var query = "INSERT INTO events (poster_email, event_name, location, posted_by, date, details) VALUES (?, ?, ?, ?, ?, ?)"
      connection.query(query, [req.body.poster_email, req.body.event_name, req.body.location, req.body.posted_by, req.body.date, req.body.details], function(err, response){
          if (err) throw err;
      });
    });

  app.get('/events', function(req, res){
  
	  var query = "SELECT * FROM events";

	  connection.query(query, function(err, result) {
		  // res.json(result);
      res.render('events', {
      	events: result
      });
    });

  });

  app.get("/network", function(req, res) {

    var query = "SELECT * FROM users";
    connection.query(query, function(err, result) {
		  // res.json(result);
      res.render('network', {
        users: result,
        first_name: result[0].first_name
      });
    });
  });

});



app.listen(PORT, function(err){
    if (err) throw err
    console.log("Listening on port: " + PORT);
});