var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
// var multiparty = require('multiparty');
var FormData = require('form-data');
var fs = require('fs');

router.get('/', (req, res) =>{
	res.send("ocr, / called." + req.requestTime);
});
router.get('/test', (req, res) => {
	console.log("get successful");
	res.send("success");
});
// router.post('/test', (req,res) => {
//     var form = new multiparty.Form();
// 	form.parse(req, (err, fields, files) => {
// 		// Parse the form sent from front end application
// 		console.log({'test':'json'});
// 		// console.log("FILES");
// 		var fileJson = files['files'][0];
// 		console.log(fileJson);
// 		var filename = files['files'][0]['originalFilename'];
// 		console.log('filename: ' + filename);
// 		var filePath = files['files'][0]['path'];
// 		console.log('filePath: ' + filePath);
// 		// console.log(files['']);
// 		console.log('fields: ' + fields);
// 		var ocrOptions = fields['options'][0];
// 		console.log('ocrOptions: ' + ocrOptions);
// 		// console.log(form);
		
// 		// Create new form for ocr request
// 		var newForm = new FormData();
// 		var file = fs.readFileSync(filePath, 'utf8');
// 		console.log('file: ' + file);
// 		newForm.append('files', file, filename);
// 		newForm.append('options', ocrOptions);
// 		// newForm = JSON.stringify(newForm);
		
// 		// Create settings for ocr request
// 		var _url = "https://sandbox.api.sap.com/ml/ocr/ocr/";
// 		var _apiKey = "QEkc0UduJQtxhBA3oVAdbpzCda0qFPSe";
// 		var options = {
// 			url :_url,
// 			headers:{
// 				'apiKey':_apiKey,
// 				'Accept':'application/json'
// 				// 'Access-Control-Allow-Origin': '*'
// 			},
// 			data: newForm
// 		};
// 		// have to get the file and title from the form received by multiparty, then fomrat it correctly
// 		request.post(options, (err, res, body) => {
// 			// console.log(res);
// 			console.log(body);
// 		});
// 	});
// });
router.get('/options', (req, res) => {
	var options = {
		url:'https://sandbox.api.sap.com/ml/ocr/ocr/',
		apiKey:'QEkc0UduJQtxhBA3oVAdbpzCda0qFPSe'
	};
	res.send(options);
});


module.exports = router;