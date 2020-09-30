import rulesService from '../service/RulesService';
import {individualRegistration} from '../RuleExecutor';

const decisionRules = (req, res, next) => {
  rulesService.findRulesById(req.body, res, next) 
    .then(async function (data) {
        const rulevalidated = await individualRegistration(JSON.parse(JSON.stringify(data))[0].rules,req.body);
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

const visitScheduleRules = async (req, res, next) => {
  try {
    const rulevalidated = await individualRegistration(req.body.rule.code, req.body);
    res.status(200)
      .json({
        status: 'success',
        visitSchedules: rulevalidated
      });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
    decisionRules: decisionRules,
    visitScheduleRules:visitScheduleRules
};