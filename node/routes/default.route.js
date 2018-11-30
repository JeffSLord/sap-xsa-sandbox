var express = require("express");
var router = express.Router();
var request = require('request');
var default_controler = require('../controllers/default.controller');

// Handle get at path '/'
router.get("/", (req, res) => {
	console.log(req);
	if(!req.authInfo.checkLocalScope('Read')){
		res.writeHead(403,{'Content-Type':'application/json'});
		console.error('[ERROR] User is not authorized.');
		res.end('{}');
	}
	res.send(`Welcome to my application, ${req.user.id}.`);
});
// router.get('/', default_controller.get);
// Handle get at path '/ip'
router.get("/ip", (req, res) => {
	request("http://httpbin.org/ip", (err, res2, body) => {
		res.write(`Current IP address is: \n`);
		res.write(body);
		res.end();
	});
});
// router.get("/test", (req, res) = > {
	
// });

module.exports = router;