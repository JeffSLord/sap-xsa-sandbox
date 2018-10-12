/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs  = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port  = process.env.PORT || 3000;
// var express = require("express");

// var app = express();

var options = {
	anonymous : true, // remove to authenticate calls
	redirectUrl : "/index.xsjs"
};

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
// var xsjsApp = xsjs(options);
xsjs(options).listen(port);
// app.use(xsjsApp);
// app.get('/node', (req, res) => {
// 	res.send("node");
// });
// var server = app.listen(port, function () {
//   console.log('Server listening on port ' + port);
// });

console.log("Server listening on port %d", port);
