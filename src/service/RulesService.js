import BaseService from "./BaseService";

class RulesService extends BaseService{
    findRulesById (req, res, next) {
        return this.db.any('select decision_rule as rules from form where uuid = $1', [req.ruleUuid]);
    }
}

export default new RulesService();