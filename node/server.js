var express = require('express');
var bodyParser = require('body-parser');
const passport=require("passport");
const {JWTStrategy}=require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const services = xsenv.getServices({uaa: "jeffauthorization-uaa"});
require('dotenv').config();

// var xsenv = require('@sap/xsenv');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set passport strategy (authentication method) as JWT based on the uaa services
passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT", {session:false}));

app.use((req, res, next) => {
	req.requestTime = Date.now();
	next();
});
app.use("/", require("./routes/default.route"));
app.use("/ocr", require("./routes/ocr.route"));
app.get("/security", (req, res) => {
	res.send(`Successful authentication as ${req.user.id}`);
});


var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
server.timeout=3000;