var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
require('dotenv').config();

// var xsenv = require('@sap/xsenv');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
	req.requestTime = Date.now();
	next();
});

// Handle get at path '/'
app.get("/", (req, res) => {
	res.send("Welcome to my application.");
});
// Handle get at path '/ip'
app.get("/ip", (req, res) => {
	request("http://httpbin.org/ip", (err, res2, body) => {
		res.send(body);
	});
});
// Use a route file that we created
// All paths inside this ocr.route file will be prefixed with '/ocr' to access
app.use("/ocr", require("./routes/ocr.route"));


var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
server.timeout=3000;