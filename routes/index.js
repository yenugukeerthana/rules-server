var express = require('express');
var router = express.Router();

var programEncounterController = require('../src/controllers/programEncounterController');
var individualController = require('../src/controllers/individualController');

router.post('/api/rules', programEncounterController.generateRules);

router.post('/api/decisionrule', individualController.decisionRules);

module.exports = router;