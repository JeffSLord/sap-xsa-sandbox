var express = require("express");
var router = express.Router();
var ocr_controller = require('../controllers/ocr.controller');
const hdbext = require("@sap/hdbext");
const xsenv = require("@sap/xsenv");
const services = xsenv.getServices({
	hanaConfig: {
		tag: "hana"
	}
});

router.get('/', (req, res) => {
	res.send("ocr, / called." + req.requestTime);
});
// router.get('/line', () => ocr_controller.line_get);
router.get('/line', (req, res, next) => {
	console.log("[INFO] Call line_get.");
	hdbext.createConnection(services.hanaConfig, (err, client) => {
		if (err) {
			console.error(err);
			res.status(500).send("[ERROR] ", err);
		}
		client.exec(`SELECT * FROM "CongressMarks.LINES"`, (err, qres) => {
			client.end();
			if (err) {
				console.error(err);
				res.status(500).send("[ERROR] ", err);
			} else {
				console.log("[SUCCESS] Select Successful.");
				res.send(qres);
			}
		});
	});
});
router.post('/line', (req, res, next) => {
	if (!req.authInfo.checkLocalScope('Edit')) {
		res.writeHead(403, {
			'Content-Type': 'application/json'
		});
		console.error('[ERROR] User is not authorized.');
		next('[ERROR] User is not authorized.');
		res.end('{}');
	} else {
		console.log("[INFO] Call line_post.");
		var fileName = req.body.fileName;
		var pageNum = req.body.pageNum;
		var lineNum = req.body.lineNum;
		var line = req.body.line;
		// var query = 'INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.LINES" VALUES(?,?,?,?)';
		hdbext.createConnection(services.hanaConfig, (err, client) => {
			if (err) {
				console.error("[ERROR] ", err);
				res.status(500).send("[ERROR] ", err);
			}
			client.prepare('INSERT INTO "CongressMarks.LINES" VALUES(?,?,?,?)', (perr,
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
	}
});
router.delete('/line', (req, res, next) => {
	console.log("[INFO] Call line_delete.");
	if (!req.authInfo.checkLocalScope('Edit')) {
		res.writeHead(403, {
			'Content-Type': 'application/json'
		});
		console.error('[ERROR] User is not authorized.');
		next('[ERROR] User is not authorized.');
		res.end('{}');
	} else {
		var fileName = req.body.fileName;
		hdbext.createConnection(services.hanaConfig, (err, client) => {
			if (err) {
				console.error("[ERROR] ", err);
				res.status(500).send("[ERROR] ", err);
			}
			client.prepare('call "SP_DELETE_LINES" (?)', (err, statement) => {
				if (err) {
					console.error("[ERROR] ", err);
					res.status(500).send("[ERROR] ", err);
				} else {
					statement.exec({
						FILENAME: fileName
					}, (err, parameters) => {
						if (err) {
							console.log("[ERROR] ", err);
							res.status(500).send("[ERROR] ", err);
						} else {
							console.log("[SUCCESS] Delete lines successful.");
							res.send("[SUCCESS] Delete lines successful.");
						}
					});
				}
			});
		});
	}
});
router.post('/page', (req, res, next) => {
	var fileName = req.body.fileName;
	var text = req.body.text;
	hdbext.createConnection(services.hanaConfig, (err, client) => {
		client.prepare('INSERT INTO "CongressMarks.PAGES" VALUES(?,?)', (err,
			statement) => {
			if (err) {
				console.error("[ERROR] Prepare: ", err);
				res.status(500).send("[ERROR] : ", err);
			} else {
				statement.exec([fileName, text], (err, rows) => {
					client.end();
					if (err) {
						// console.error("[ERROR] Execute: ", eerr);
						// res.status(500).send("[ERROR]: ", eerr);
					} else {
						console.log("[SUCCESS] Page insert successful.");
						res.send("[SUCCESS] Page Insert Success.");
					}
				});
			}
		});
	});
});
router.delete('/page', (req, res, next) => {
	console.log("[INFO] Call page_delete.");
	var fileName = req.body.fileName;
	hdbext.createConnection(services.hanaConfig, (err, client) => {
		if (err) {
			console.error("[ERROR] ", err);
			res.status(500).send("[ERROR] ", err);
		} else {
			client.prepare('call "SP_DELETE_PAGE" (?)', (err, statement) => {
				if (err) {
					console.error("[ERROR] ", err);
					res.status(500).send("[ERROR] ", err);
				} else {
					statement.exec({
						FILENAME: fileName
					}, (err, parameters) => {
						if (err) {
							console.error("[ERROR] ", err);
							res.status(500).SEND("[ERROR] ", err);
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

module.exports = router;