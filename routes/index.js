var express = require('express');
var router = express.Router();

var db = require('../server/db');

router.get('/api/rules', db.generateRules);
module.exports = router;