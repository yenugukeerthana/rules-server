var promise = require('bluebird');
import {programEnocunter} from '../src/RuleExecutor';
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'openchs',
  user: 'amol',
  password: ''
};
var db = pgp(connectionString);

function generateRules(req, res, next) {
  const uuid = "38a778be-991f-40f0-9837-7244836ecdfc";
  db.any(`select decision_rule as rules from form where uuid = $1`, [uuid])
    .then(function (data) {
      const rulevalidated = programEnocunter(JSON.parse(JSON.stringify(data))[0].rules);
      res.status(200)
        .json({
          status: 'success',
          data: rulevalidated
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  generateRules: generateRules
};