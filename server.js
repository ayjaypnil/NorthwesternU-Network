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

//set up sessions
var cookieParser = require('cookie-parser');
var session = require('express-session');

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 6 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000 } }));
app.use(cookieParser());




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs"); 

app.use(express.static("public"));






  app.get("/", function(req, res) {
    res.render(__dirname + "/views/main.ejs");
  });

  app.get("/home", function(req, res) {
    
      if (req.session.logged_in) {
        res.render(__dirname + "/views/home.ejs");
      } else {
        res.render(__dirname + "/views/main.ejs");
      }
  });

  // app.get("/profile", function(req, res) {
  //   res.render( __dirname + "/views/profile.ejs");
  // });

  app.get("/newevent", function(req, res) {
     if (req.session.logged_in) {
        res.render(__dirname + "/views/newevent.ejs");   
    } else{
        res.render(__dirname + "/views/main.ejs");
     }
  });

  app.get("/login", function(req, res) {
    if (req.session.logged_in) {
      res.redirect("/home");
    }
    res.render(__dirname + "/views/login.ejs");
  });



  var email;

  connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);

    app.post("/sign-in", function(req, res) {
      if (req.session.logged_in) {
        res.redirect("/home");
      }

      var query = "SELECT * FROM users WHERE email = (?) AND password_hash = (?)";

      connection.query(
        query,
        [req.body.email, req.body.password_hash],
        function(err, result) {
          if (result.length > 0) {
            req.session.logged_in = true;
            req.session.email = result[0].email;

            email = req.session.email;
            app.get("/profile", function(req, res) {
              var query = "SELECT * FROM users where email = (?)";
              connection.query(query, [email], function(err, result) {
                // res.json(result);
                // var user_info = {
                (user_email = result[0].email),
                  (first_name = result[0].first_name),
                  (last_name = result[0].last_name),
                  (campus = result[0].campus),
                  (grad_date = result[0].grad_date),
                  (site_link = result[0].site_link);
                // }

                res.render(__dirname + "/views/profile.ejs", {
                  data: result
                });
              });
            });

            res.redirect("/home");
          } else {
            res.redirect("/login");
          }
        }
      );
    });

    app.get("/signup", function(req, res) {
      if (req.session.logged_in) {
        res.redirect("/home");
      }
      res.render(__dirname + "/views/signup.ejs");
    });

    app.post("/create-user", function(req, res) {
      if (req.session.logged_in) {
        res.redirect("/home");
      }

      var query = "INSERT INTO users (email, password_hash, first_name, last_name, campus, grad_date, site_link) VALUES (?, ?, ?, ?, ?, ?, ?)";

      connection.query(
        query,
        [
          req.body.email,
          req.body.password_hash,
          req.body.first_name,
          req.body.last_name,
          req.body.campus,
          req.body.grad_date,
          req.body.site_link
        ],
        function(err, result) {
          console.log(err, result);
          if (err) {
            res.send("there was an error");
          }

          req.session.logged_in = true;
          req.session.username = req.body.email;

          res.redirect("/home");
        }
      );
    });

    app.get("/signup", function(req, res) {
      res.render(__dirname + "/views/signup.ejs");
    });

    app.get("/logout", function(req, res) {
      req.session.destroy(function(err) {
        res.redirect("/");
      });
    });

    app.get("/newjob", function(req, res) {

      if (req.session.logged_in) {
      res.render(__dirname + "/views/newjob.ejs");
      } else {
        res.render(__dirname + "/views/main.ejs");
      }
    });

    app.post("/createevent", function(req, res) {
      var newEvent = req.body;
      // console.log(newMember);
      var query = "INSERT INTO events (poster_email, event_name, location, posted_by, date, details) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [
          req.body.poster_email,
          req.body.event_name,
          req.body.location,
          req.body.posted_by,
          req.body.date,
          req.body.details
        ],
        function(err, response) {
          if (err) throw err;
        }
      );
    });

    app.get("/events", function(req, res) {
    
      if (req.session.logged_in) {
          var query = "SELECT * FROM events";

          connection.query(query, function(err, result) {
            // res.json(result);
            res.render("events", { events: result });
          });
      } else {
        res.render(__dirname + "/views/main.ejs");
      }
    });

    app.get("/network", function(req, res) {

        if (req.session.logged_in) {
            var query = "SELECT * FROM users ORDER BY last_name";
            connection.query(query, function(err, result) {
              // res.json(result);
              res.render("network", { users: result });
            });
        } else {
          res.render(__dirname + "/views/main.ejs");
        }
    });

    app.post("/createjob", function(req, res) {
      var newJob = req.body;

      var query = "INSERT INTO jobs (job_title, poster_name, poster_email, job_description, date_posted, link) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [
          newJob.job_title,
          newJob.poster_name,
          newJob.poster_email,
          newJob.job_description,
          newJob.date_posted,
          newJob.link
        ],
        function(err, response) {
          if (err) throw err;
        });
    });

    app.get("/jobs", function(req, res) {

        if (req.session.logged_in) {
           var query = "SELECT * FROM jobs";
           connection.query(query, function(err, result) {
             // res.json(result);
             res.render("jobs", { jobs: result });
            });
        } else {
          res.render(__dirname + "/views/main.ejs");
        }
    });
});



app.listen(PORT, function(err){
    if (err) throw err
    console.log("Listening on port: " + PORT);
});