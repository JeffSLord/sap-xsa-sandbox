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
router.get('/options', (req, res) => {
	var options = {
		url: 'https://sandbox.api.sap.com/ml/ocr/ocr/',
		apiKey: 'QEkc0UduJQtxhBA3oVAdbpzCda0qFPSe'
	};
	res.send(options);
});
// router.get('/test', (req, res) => {
// 	console.log("get successful");
// 	res.send("success");
// });

router.post('/linedelete', (req, res) => {
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			res.send(err);
			return console.error(err);
		}
		client.exec(`DELETE FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES"`, (qerr, qres) => {
			if (qerr) {
				res.send(qerr);
				return qerr;
			} else {
				console.log("[INFO] Delete Successful.");
				res.send(qres + " Delete successful");
				// return qres;
			}
		});
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
		client.prepare(`INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)`, (perr,
			statement) => {
			if (err) {
				console.log(err);
				res.send(perr);
			} else {
				// console.log("StatementID: ", statement.id);
				statement.exec([fileName, pageNum, lineNum, line], (eerr, rows) => {
					if (eerr) {
						console.log(eerr);
						res.send(eerr);
					} else {
						console.log("Single Insert Successful.");
						res.send("[INFO] SUCCESS");
						// res.send(rows);
					}
				});
			}
		});
	});
});
router.post('/lineMany', (req, res) => {
	var results = {};
	var query = `INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)`;
	// client.prepare(query, (perr, statement) => {
	// 	if(perr){
	// 		res.send(perr);
	// 	}else{
	// 		hdbext.createConnection(hanaConfig, (cerr, client) => {
	// 			if(cerr){
	// 				res.send(cerr);
	// 			}else{
					
	// 			}
	// 		})
	// 	}
	// })
	// client.prepare(`INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)`, (perr,

	
	
	
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			client.prepare(query, (perr, statement) => {
				if (perr) {
					res.send(perr);
				} else {
					var data = req.body;
					var fileName = data.fileName;
					var pageNum = data.pageNum;
					var lines = data.lines;
					for (var i = 0; i < lines.length; i++) {
						var lineNum = i;
						var line = lines[i];
						statement.exec([fileName, pageNum, lineNum, line], (eerr, rows) => {
							if (eerr) {
								console.log("[INFO] Name: " + fileName + ", Num: " + pageNum + ", Line: " + lineNum + ", Text: " + line);
								console.error("[ERROR] " + eerr.toString());
								results[i] = ["Error: " + eerr];
							} else {
								console.log("[INFO] Success");
								results[i] = ["SUCCESS"];
							}
						});
					}
				}
			});
		}
	});
	res.send(JSON.stringify(results));
});
router.get('/line', (req, res) => {
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			return console.error(err);
		}
		client.exec(`SELECT * FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES"`, (qerr, qres) => {
			if (qerr) {
				res.send(qerr);
				return console.error(qerr);
			} else {
				console.log("[INFO] Select Successful.");
				// console.log(qres);
				res.send(qres);
				return (qres);
			}
		});
	});
});

// router.post('/linetest', (req, res) => {
// 	var fileName = req.fileName;
// 	var pageNum = req.pageNum;
// 	var lineNum = req.lineNum;
// 	var line = req.line;

// 	hdbext.createConnection(hanaConfig, function(err, client) {
// 		console.log("[INFO] posted");
// 		if (err) {
// 			return console.error(err);
// 		}
// 		client.exec("SELECT * FROM DUMMY", (err2, res2) => {
// 			if (err2) {
// 				return console.error(err2);
// 			} else {
// 				console.log(`Result: ${res2}`);
// 				res.send(res2);
// 				return (err2);
// 			}
// 		});
// 	});
// });

module.exports = router;