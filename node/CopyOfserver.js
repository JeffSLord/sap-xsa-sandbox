var express = require('express');
// var xsenv = require('@sap/xsenv');

var app = express();

app.get('/', (req, res) => {
	res.send("it works!");
});
app.get('/hey', (req, res) => {
	res.send("hi there.");
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});