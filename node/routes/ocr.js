var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
// var multiparty = require('multiparty');
var FormData = require('form-data');
var fs = require('fs');
var hdbext = require("@sap/hdbext");

var hanaConfig = {
	host: 'ec2-54-158-20-168.compute-1.amazonaws.com',
	port: 30015,
	user: 'jeff',
	password: 'Hana12345'
};

router.get('/', (req, res) => {
	res.send("ocr, / called." + req.requestTime);
});
router.get('/test', (req, res) => {
	console.log("get successful");
	res.send("success");
});

router.post('/linedelete', (req, res) => {
	hdbext.createConnection(hanaConfig, (err, client) => {
		if(err) {
			res.send(err);
			return console.error(err);
		}
		client.exec(`DELETE FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES"`, (qerr, qres) =>{
			if(qerr){
				res.send(qerr);
				return qerr;
			}else{
				console.log("ERROR WHEN IT WORKS");
				console.log(qerr);
				// client.exec('COMMIT',(e,r) =>{});
				console.log("Truncate successful.");
				res.send(qres + " Delete successful");
				// return qres;
			}
		} );
	});
});
router.post('/line', (req, res) => {
	var fileName = req.body.fileName;
	var pageNum = req.body.pageNum;
	var lineNum = req.body.lineNum;
	var line = req.body.line;
	// console.log(req);
	hdbext.createConnection(hanaConfig, function(err, client) {
		if (err) {
			return console.error(err);
		}
		client.prepare(`INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)`, (perr, statement) => {
			if(err){
				console.log(err);
				res.send(perr);
			}else{
				// console.log("StatementID: ", statement.id);
				statement.exec([fileName, pageNum, lineNum, line], (eerr, rows) =>{
					if(eerr){
						console.log(eerr);
						res.send(eerr);
					} else{
						res.send("SUCCESS");
						// res.send(rows);
					}
				});
			}
		});
		// client.exec(`INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES("${fileName}", "${pageNum}", "${lineNum}", "${line}")`, (err2, res2) => {
		// 	if (err2) {
		// 		console.log("BEGIN ERR");
		// 		console.log(err2);
		// 		console.log("END ERR");
		// 		res.send("ERROR" + err2);
		// 	} else {
		// 		console.log(`Result: ${res2}`);
		// 		res.send("SUCCESS");
		// 	}
		// });
		// console.log("Ending insert/post");
		
	});
});
router.post('/lineMany', (req,res) => {
	// hdbext.createConnection(hanaConfig, (err, client) =>{
	// 	if(err){
	// 		console.error(err);
	// 		res.send(err);
	// 	}else{
	// 		client.prepare(`INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)`, (perr, statement) => {
	// 			for(var i=0; i< req.body.lines.length; i++){
	// 				//
	// 			}
	// 		}
	// 		//loop through all
	// 	}
	// });
});
router.get('/line',(req,res) => {
	hdbext.createConnection(hanaConfig, (err, client) => {
		if(err){
			return console.error(err);
		}
		client.exec(`SELECT * FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES"`, (qerr, qres) =>{
			if(qerr){
				res.send(qerr);
				return console.error(qerr);
			}else{
				console.log(qres);
				res.send(qres);
				return(qres);
			}
		});
	});
});

router.post('/linetest', (req, res) => {
	var fileName = req.fileName;
	var pageNum = req.pageNum;
	var lineNum = req.lineNum;
	var line = req.line;

	hdbext.createConnection(hanaConfig, function(err, client) {
		console.log("posted");
		if (err) {
			return console.error(err);
		}
		client.exec("SELECT * FROM DUMMY", (err2, res2) => {
			if (err2) {
				return console.error(err2);
			} else {
				console.log(`Result: ${res2}`);
				res.send(res2);
				return(err2);
			}
		});
	});
});

router.get('/options', (req, res) => {
	var options = {
		url: 'https://sandbox.api.sap.com/ml/ocr/ocr/',
		apiKey: 'QEkc0UduJQtxhBA3oVAdbpzCda0qFPSe'
	};
	res.send(options);
});

module.exports = router;