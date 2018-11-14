var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

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
// var options ={
// 	url:"http://httpbin.org/ip",
// 	headers:{
		
// 	}
// };
// app.use("/r1", require("./routes/r1"));
// app.use("/r2", require("./routes/r2"));
app.use("/ocr", require("./routes/ocr"));
// app.use("/security", require("./routes/security"));



// // old version requiring 'target' to be set in xs-app.json
// app.get('/', (req, res) => {
// 	res.send("it works!");
// });
// app.get('/hey', (req, res) => {
// 	res.send("hi there.");
// });
// //


var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
server.timeout=3000;