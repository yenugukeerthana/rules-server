import {executeRule} from '../RuleExecutor';

export const rulesController = async (req, res, next) => {
    try {
        const ruleResponse = await executeRule(req.body);
        ruleResponse.status = "success";
        res.status(200).json(ruleResponse);
    } catch (err) {
        console.log(err);
        res.status(222)
            .json({
                status: 'failure',
                error: {
                    message: err.message,
                    stack: err.stack
                }
            })
    }
}
