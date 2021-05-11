import {rulesController, cleanRulesCache, summary} from "../src/controllers/rulesController";

const express = require('express');
const router = express.Router();

router.post('/api/rules', rulesController);
router.get('/api/cleanRulesCache', cleanRulesCache);
router.post('/api/summaryRule', summary);

module.exports = router;
