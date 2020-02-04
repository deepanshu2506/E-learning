var express = require('express');
var router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');

router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));
const admin = require('../controllers/admin');

// const config = require('../config/variables');

router.post('/createQuiz' , admin.createQuiz);
router.post('/createQuestion' , admin.createQuestion)
router.post('/validateQuiz' , admin.validateQuiz);
router.post('/getQuizes',admin.getQuizes)




module.exports = router;