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

app.get("/", (req, res) => {
	res.send("Please go to /r1 or /r2.");
});
app.get("/ip", (req, res) => {
	request("http://httpbin.org/ip", (err, res2, body) => {
		res.send(body);
	});
});
app.use("/ocr", require("./routes/ocr.route"));


var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
server.timeout=3000;