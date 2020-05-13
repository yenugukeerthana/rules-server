import BaseService from "./BaseService";

class RulesService extends BaseService{
    findRulesById (req, res, next) {
        if(req.rule && req.rule.ruleType == 'Decision'){
            return this.db.any('select decision_rule as rules from form where uuid = $1', [req.rule.formUuid]);
        }
    }
}

export default new RulesService();