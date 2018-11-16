var express = require("express");
var router = express.Router();
// var bodyParser = require('body-parser');
// var request = require('request');
// var FormData = require('form-data');
// var fs = require('fs');
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
router.get('/line', (req, res) => {
	console.log("[INFO] Getting /line");
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			console.error(err);
			res.status(500).send("[ERROR] ", err);
		}
		client.exec(`SELECT * FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES"`, (qerr, qres) => {
			client.end();
			if (qerr) {
				console.error(qerr);
				res.status(500).send("[ERROR] ", qerr);
			} else {
				console.log("[SUCCESS] Select Successful.");
				res.send(qres);
			}
		});
	});
});
router.get('/linedelete', (req, res) => {
	res.send('[INFO] Deletes line table.');	
});
router.post('/line', (req, res) => {
	console.log("[INFO] Posting to /line");
	var fileName = req.body.fileName;
	var pageNum = req.body.pageNum;
	var lineNum = req.body.lineNum;
	var line = req.body.line;
	// var query = 'INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)';
	hdbext.createConnection(hanaConfig, function(err, client) {
		if (err) {
			console.error("[ERROR] ", err);
			res.status(500).send("[ERROR] ", err);
		}
		client.prepare('INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)', (perr,
			statement) => {
			if (err) {
				console.error("[ERROR] ", perr);
				res.status(500).send("[ERROR] ", perr);
			} else {
				// console.log("StatementID: ", statement.id);
				statement.exec([fileName, pageNum, lineNum, line], (eerr, rows) => {
					client.end();
					if (eerr) {
						console.error("[ERROR] ", eerr);
						console.error("[ERROR] ", fileName, pageNum, lineNum, line);
						res.status(500).send("[ERROR] ", eerr);
					} else {
						console.log("[SUCCESS] Single Insert Successful.");
						console.log("[SUCCESS] ", fileName, pageNum, lineNum, line);
						res.status(200).send("[INFO] SUCCESS");
						// res.send(rows);
					}
				});
			}
		});
	});
});
router.post('/linedelete', (req, res) => {
	console.log("[INFO] Posting to /linedelete");
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			console.error("[ERROR] ", err);
			res.status(500).send("[ERROR] ", err);
		}
		client.exec('DELETE FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES"', (qerr, qres) => {
			client.end();
			if (qerr) {
				console.error("[ERROR] ", qerr);
				res.status(500).send("[ERROR] ", qerr);
			} else {
				console.log("[SUCCESS] Delete Successful.");
				res.send("[SUCCESS] Delete successful");
				// return qres;
			}
		});
	});
});
router.post('/page', (req, res) => {
	console.log("[INFO] Posting to /page");
	// var query = 'INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.PAGES" VALUES(?,?)';
	var fileName = req.body.fileName;
	var text = req.body.text;
	hdbext.createConnection(hanaConfig, function(err, client) {
		if (err) {
			console.error("[ERROR] ", err);
			res.status(500).send("[ERROR] ", err);
		}
		client.exec(`DELETE FROM "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.PAGES" WHERE FILENAME=${fileName}`, (derr, dstatement) => {
			if (derr) {
				console.error("[ERROR] Deleting Pages: ", derr);
			} else {
				console.log("[SUCCESS] Deleting Pages.");
				client.prepare('INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.PAGES" VALUES(?,?)', (perr,
					statement) => {
					if (perr) {
						console.error("[ERROR] Prepare: ", perr);
						res.status(500).send("[ERROR] : ", perr);
					} else {
						statement.exec([fileName, text], (eerr, rows) => {
							client.end();
							if (eerr) {
								// console.error("[ERROR] Execute: ", eerr);
								// res.status(500).send("[ERROR]: ", eerr);
							} else {
								console.log("[SUCCESS] Page insert successful.");
								res.send("[SUCCESS] Page Insert Success.");
							}
						});
					}
				});
			}

		});

	});
});
router.post('/lineMany', (req, res) => {
	console.log("[INFO] Posting to lineMany");
	var results = {};
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			console.error(err);
			res.send(err);
		} else {
			client.prepare('INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)', (perr,
				statement) => {
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
								console.error("[ERROR] ", eerr);
								results[i] = ["Error: ", eerr];
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

module.exports = router;