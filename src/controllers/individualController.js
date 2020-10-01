import {individualRegistration} from '../RuleExecutor';

const decisionRules = async (req, res, next) => {
    try {
        const rulevalidated = await individualRegistration(req.body.rule.code, req.body);
        res.status(200)
            .json({
                status: 'success',
                data: rulevalidated
            });
    } catch (err) {
        res.status(222)
            .json({
                status: 'failure',
                message: err.message,
                stack: err.stack
            })
    }
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
