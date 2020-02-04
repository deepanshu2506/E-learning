var express = require('express');
var router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');

router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));
const front = require('../controllers/front');

// const config = require('../config/variables');



router.post('/joinSession' , front.joinSession);
router.post('/getActiveUsers',front.getActiveUsers);
router.post('/getQuiz',front.getQuiz);
router.post('/setAnswer',front.setAnswer);
router.post('/getAnalysis',front.getAnalysis)



module.exports = router;