var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var ejs = require('ejs');
var mysql = require("mysql");
var app = express();




var PORT = process.env.PORT || 3000;


if (app.settings.env == 'development'){
  var connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "",
    database: "nw_db"
  });
} else {
  var connection = mysql.createConnection(process.env.JAWSDB_URL);
};

// else {
//   connection = mysql.createConnection({
//     port: 3306,
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "ozqjz8w94gje60u3"
//   });
// };


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs"); 

app.use(express.static("public"));






app.get("/", function(req, res) {
 res.render( __dirname + "/views/main.ejs");
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

app.get("/login", function(req, res) {
  res.render(__dirname + "/views/user/login.ejs");
});

app.get("/register", function(req, res) {
  res.render(__dirname + "/views/user/register.ejs");
});
app.get("/newjob", function(req, res) {
  res.render(__dirname + "/views/newjob.ejs");
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
        users: result
      });
    });
  });

    app.post('/createjob', function(req, res){
      var newJob = req.body;
      // console.log(newMember);
      var query = "INSERT INTO jobs (job_title, poster_name, poster_email, job_description, date_posted, link) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(query, [req.body.job_title, req.body.poster_email, req.body.job_description, req.body.job_description, req.body.date_posted, req.body.link], function(err, response){
            if (err) throw err;
        });
    });

  app.get("/jobs", function(req, res) {
    var query = "SELECT * FROM jobs";
    connection.query(query, function(err, result) {
		  // res.json(result);
      res.render('jobs', {
        jobs: result
      });
    });
  });
});



app.listen(PORT, function(err){
    if (err) throw err
    console.log("Listening on port: " + PORT);
});