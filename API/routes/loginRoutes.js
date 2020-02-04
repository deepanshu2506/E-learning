var express = require('express');
var router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');

router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));
const auth = require('../controllers/login');

// const config = require('../config/variables');

router.post('/authenticateAdmin' , auth.authenticateAdmin);
router.post('/authenticateLearner' , auth.authenticateLearner);
router.post('/register' , auth.register);
router.post('/getUser' , auth.getUser);
router.post('/getAdmin' , auth.getAdmin);





module.exports = router;