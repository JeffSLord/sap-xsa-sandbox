var express = require("express");
var router = express.Router();

router.get('/', (req, res) =>{
	res.send("r2, / called.");
});
router.get('/hi', (req,res)=>{
	res.send("hello from r2");
});

module.exports = router;