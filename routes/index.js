import {
    rulesController,
    cleanRulesCache,
    summary,
    buildObservationAndRunRules, encounterEligibility,
    schedule,
    message, messagingResponse
} from "../src/controllers/rulesController";

const express = require('express');
const router = express.Router();

router.post('/api/rules', rulesController);
router.get('/api/cleanRulesCache', cleanRulesCache);
router.post('/api/summaryRule', summary);
router.post('/api/encounterEligibility', encounterEligibility);
router.post('/api/upload', buildObservationAndRunRules);
router.post('/api/messagingRule', messagingResponse);

module.exports = router;
