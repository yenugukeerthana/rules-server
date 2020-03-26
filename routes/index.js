var express = require('express');
var router = express.Router();

var programEncounterController = require('../src/controllers/programEncounterController');

router.post('/api/rules', programEncounterController.generateRules);

module.exports = router;