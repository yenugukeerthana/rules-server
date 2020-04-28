var express = require('express');
var router = express.Router();

var programEncounterController = require('../src/controllers/programEncounterController');
var individualController = require('../src/controllers/individualController');

router.post('/api/program_encounter_rule', programEncounterController.generateRules);

router.post('/api/individual_rule', individualController.decisionRules);

module.exports = router;