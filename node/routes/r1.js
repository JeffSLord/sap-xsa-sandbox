var express = require("express");
var router = express.Router();

router.get('/', (req, res) =>{
	res.send("r1, / called." + req.requestTime);
});
router.get('/hi', (req,res)=>{
	res.send("hello from r1");
});

module.exports = router;