const hdbext = require("@sap/hdbext");
const xsenv = require("@sap/xsenv");
const auth = require("./auth.controller");
const services =  xsenv.getServices({hanaConfig: {tag: "hana"}});
// const express = require('express');
// const router = express.Router();


// var hanaConfig = {
// 	host: process.env.DB_HOST,
// 	port: process.env.DB_PORT,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASS
// };


exports.line_get = (req, res, next) => {
	console.log("[INFO] Call line_get.");
	hdbext.createConnection(services.hanaConfig, (err, client) => {
		if (err) {
			console.error(err);
			res.status(500).send("[ERROR] ", err);
		}
		client.exec(`SELECT * FROM "CongressMarks.LINES"`, (err, res) => {
			client.end();
			if (err) {
				console.error(err);
				res.status(500).send("[ERROR] ", err);
			} else {
				console.log("[SUCCESS] Select Successful.");
				res.send(res);
			}
		});
	});
};
exports.line_post = (req, res, next) => {
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
		hdbext.createConnection(hanaConfig, (err, client) => {
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
	}
};
exports.line_delete = (req, res, next) => {
	console.log("[INFO] Call line_delete.");
	var fileName = req.body.fileName;
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			console.error("[ERROR] ", err);
			res.status(500).send("[ERROR] ", err);
		}
		client.prepare('call "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds.procedures::SP_DELETE_LINES" (?)', (err, statement) => {
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
};
exports.page_post = (req, res, next) => {
	var fileName = req.body.fileName;
	var text = req.body.text;
	hdbext.createConnection(hanaConfig, (err, client) => {
		client.prepare('INSERT INTO "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds::CongressMarks.PAGES" VALUES(?,?)', (err,
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
};
exports.page_delete = (req, res, next) => {
	console.log("[INFO] Call page_delete.");
	var fileName = req.body.fileName;
	hdbext.createConnection(hanaConfig, (err, client) => {
		if (err) {
			console.error("[ERROR] ", err);
			res.status(500).send("[ERROR] ", err);
		} else {
			client.prepare('call "XSA_SANDBOX_HDI_HDB_CDS_2"."sap_xsa_sandbox.hdb_cds.procedures::SP_DELETE_PAGE" (?)', (err, statement) => {
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
};