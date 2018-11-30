// var express = require("express");
// var router = express.Router();

// router.get('/read', (req, res) =>{
// 	if(!req.authInfo.checkLocalScope('Read)')){
// 		res.writeHead(403,{'Content-Type':'application/json'});
// 		console.error("User is not authorized");
// 		res.end('{}');
// 	}else{
// 		res.writeHead(200,{'Content-Type':'application/json'});
// 		console.write("User successfully authorized");
// 		res.end(JSON.stringify({result: "Success!"}));
// 	}
// });
// router.get('/edit', (req,res)=>{
// 	if(!req.authInfo.checkLocalScope('Edit)')){
// 		res.writeHead(403,{'Content-Type':'application/json'});
// 		console.error("User is not authorized");
// 		res.end('{}');
// 	}else{
// 		res.writeHead(200,{'Content-Type':'application/json'});
// 		console.write("User successfully authorized");
// 		res.end(JSON.stringify({result: "Success!"}));
// 	}
// });

// module.exports = router;