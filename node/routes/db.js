var express = require("express");
var router = express.Router();
var hdbext = require("sap/hdbext");

const hanaConfig = {
	host: "",
	port: 12345,
	user: "",
	password:""
};

const sample = {
	sql1: ""
};

router.get('/', (req, res) =>{
	hdbext.createConnection(hanaConfig, (err, client) => {
		if(err){
			console.error(err);
		}
		client.exec(req.sql, (qerr, qres) => {
			if(qerr){
				console.error(qerr);
			}
			res.send(qres);
		});
	});
});

router.get('/client', (req, res) => {
	hdbext.createConnectxion(req.hanaConfig, (err, client) => {
		if(!err){
			res.send(client);
		}
	});
});

module.exports = router;