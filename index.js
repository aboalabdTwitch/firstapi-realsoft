const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
var cors = require("cors");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var mysql = require("mysql");

app.use(express.json());
app.use(cors());

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(cookieParser());

var Users = [];

const port = process.env.PORT || 3000;

const { stringify } = require("querystring");
const { get } = require("request");

var con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "",
  database: "login",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/login", function (req, res) {
  con.query(
    "select username,password,role from users where username=" +
      JSON.stringify(req.body.username) +
      " and password=" +
      JSON.stringify(req.body.password),
    function (err, result, fields) {
      if (err) throw err;
      //console.log(result[0].RowDataPacket.role)
      if (result.length == 1) {
        console.log(req.session.id);
        
        res.send({ status: "found", data: result });
      } else {
        res.send({ status: "not found" });
      }
    }
  );
});

app.get("/", function (req, res) {
  res.send("GET request to homepage");
});

app.get("/surveys", function (req, res) {
  fs.readFile("data.json", "utf8", (err, data) => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log("Running ");
});

app.put("/update/:surveyId", (req, res) => {
  const surveyId = req.params.surveyId;
  let surveys = readData();
  let found = false;

  for (let arrayOfSurvey of surveys) {
    for (let survey of arrayOfSurvey) {
      if (survey.TEMPLATE_ID == surveyId) {
        found = true;
        survey.SurveyNameEn = req.body.name;
        break;
      }
    }
  }

  if (found) {
    writeData(surveys);
    res.send("found");
  } else {
    res.send("not found ");
  }
});

app.delete("/delete/:surveyId", (req, res) => {
  const surveyId = req.params.surveyId;
  let surveys = readData();
  let newData = [];
  let arrayOfNewData = [];
  let found = false;

  for (let arrayOfSurvey of surveys) {
    for (let survey of arrayOfSurvey) {
      if (survey.TEMPLATE_ID != surveyId) {
        newData.push(survey);
      } else {
        found = true;
      }
    }
  }

  arrayOfNewData.push(newData);

  if (found) {
    writeData(arrayOfNewData);
    res.send("deleted");
  } else {
    res.send("not found");
  }
});

app.post("/add", (req, res) => {
  let surveys = readData();
  surveys[0].push(req.body);
  writeData(surveys);
  res.send("done");
});

function writeData(data) {
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
  });
}

function readData() {
  let data = fs.readFileSync(path.resolve(__dirname, "data.json"));
  return JSON.parse(data);
}

app.get("/logout",(req,res)=>{
  req.session.destroy();
  console.log(req.session);
  res.redirect('/login');
})  

// //fs model
// //https://www.heroku.com/
// //express server
// //CRUD operation

