import {rulesController, cleanRulesCache} from "../src/controllers/rulesController";

const express = require('express');
const router = express.Router();

router.post('/api/rules', rulesController);
router.get('/api/cleanRulesCache', cleanRulesCache);

module.exports = router;
