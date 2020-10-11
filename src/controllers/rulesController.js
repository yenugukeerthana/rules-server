import {executeRule} from '../RuleExecutorNew';
import {buildFailureResponse} from "./Common";

export const rulesController = (req, res, next) => {
    try {
        const ruleResponse = executeRule(req.body);
        ruleResponse.status = "success";
        res.status(200)
            .json(ruleResponse);
    } catch (err) {
        //TODO: inline this
        buildFailureResponse(res, err);
    }
}
