var express = require("express");
var router = express.Router();
var ocr_controller = require('../controllers/ocr.controller');

router.get('/', (req, res) => {
	res.send("ocr, / called." + req.requestTime);
});
router.get('/line', ocr_controller.line_get);       
router.post('/line', ocr_controller.line_post);
router.delete('/line', ocr_controller.line_delete);
router.post('/page', ocr_controller.page_post);
router.delete('/page', ocr_controller.page_delete);

module.exports = router;