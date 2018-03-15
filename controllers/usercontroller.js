var bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var connection = require("../config/connection.js");



app.get("/register", function(req, res) {
  res.render(__dirname + "/views/user/register.ejs");
});




module.exports = router;