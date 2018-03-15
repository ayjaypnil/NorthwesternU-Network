var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var ejs = require('ejs');
var mysql = require("mysql");

var app = module.exports = express(); 
var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs"); 

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
 res.render( __dirname + "/views/home.ejs");
});

app.get("/home", function(req, res) {
  res.render( __dirname + "/views/home.ejs");
});

app.get("/profile", function(req, res) {
  res.render( __dirname + "/views/profile.ejs");
});

app.get("/events", function(req, res) {
  res.render( __dirname + "/views/events.ejs");
});

app.get("/network", function(req, res) {
  res.render( __dirname + "/views/network.ejs");
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

app.listen(PORT, function(err){
    if (err) throw err
    console.log("Listening on port: " + PORT);
});