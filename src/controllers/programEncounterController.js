import {programEncounter} from '../RuleExecutor';
import {buildFailureResponse} from "./Common";

const decisionRules = async (req, res, next) => {
    try {
        const rulevalidated = await programEncounter(req.body.rule.code, req.body);
        res.status(200)
            .json({
                status: 'success',
                data: rulevalidated
            });
    } catch (err) {
        buildFailureResponse(res, err);
    }
}

const visitScheduleRules = async (req, res, next) => {
  try {
    const rulevalidated = await programEncounter(req.body.rule.code, req.body);
    res.status(200)
      .json({
        status: 'success',
        visitSchedules: rulevalidated
      });
  } catch (err) {
      buildFailureResponse(res, err);
  }
}

module.exports = {
  decisionRules: decisionRules,
  visitScheduleRules : visitScheduleRules
};
