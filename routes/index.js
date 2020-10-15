import {rulesController} from "../src/controllers/rulesController";

const express = require('express');
const router = express.Router();

router.post('/api/rules', rulesController)

module.exports = router;
