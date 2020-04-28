var express = require('express');
var router = express.Router();

var programEncounterController = require('../src/controllers/programEncounterController');
var individualController = require('../src/controllers/individualController');
var programEnrolmentController = require('../src/controllers/programEnrolmentController');

router.post('/api/program_encounter_rule', programEncounterController.generateRules);

router.post('/api/individual_rule', individualController.decisionRules);

router.post('/api/program_enrolment_rule',programEnrolmentController.decisionRules);

module.exports = router;