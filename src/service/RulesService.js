import BaseService from "./BaseService";

class RulesService extends BaseService{
    findRulesById (req, res, next) {
        const uuid = "38a778be-991f-40f0-9837-7244836ecdfc";
        return this.db.any('select decision_rule as rules from form where uuid = $1', [uuid]);
    }
}

export default new RulesService();