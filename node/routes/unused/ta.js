var express = require("express");
var router = express.Router();
var hdbext=require("@sap/hdbext");
var textAnalysis=require("@sap/textanalysis");
var db = require("./db");

const hanaConfig = {
	host: "hana.chickenwings.corp",
	port: 30015,
	user: "HARALD",
	password:"easter"
}; 
const values = {
	DOCUMENT_BINARY:null,
	DOCUMENT_TEXT:"The flight was good, thank you very much for all the... chicken!",
	LANGUAGE_CODE:"EN",
	MIME_TYPE:null,
	TOKEN_SEPARATORS:null,
	LANGUAGE_DETECTION:null,
	CONFIGURATION_SCHEMA_NAME:null,
	CONFIGURATION:"EXTRACTION_CORE_VOICEOFCUSTOMER",
	RETURN_PLAINTEXT:0
};

router.get('/test', (req, res) => {
	hdbext.createConnection(hanaConfig, (err, client) => {
		if(err){
			console.error("Error connecting to DB", err);
		}
		textAnalysis.analyze(values, client, (err, parameters, rows) => {
			if(err){
				console.error("Error executing Text Analysis", err);
			}
			console.log(rows);
			res.send(rows);
		});
	});
});

module.exports = router;