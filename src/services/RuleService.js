import {defaults, identity, isEmpty, isFunction} from "lodash";
import api from "./api";
import evalRule from "./evalRule";


class RuleService {

    constructor() {
        this.cache = {};
    }


    async getApplicableRules(entityUuid, ruleType, ruledEntityType) {
        console.log("RuleService",
            `Getting Rules of Type ${ruleType} for ${ruledEntityType} - ${entityUuid}`);
        const rules = await this._getRules();
        const matchingRules = rules
            .map(identity)
            .filter(rule =>
                rule.voided === false && rule.type === ruleType &&
                rule.entity.uuid === entityUuid && rule.entity.type === ruledEntityType);
        return this._getRuleFunctions(matchingRules);
    }

    async _getRuleFunctions(rules = []) {
        const allRules = await this._getRuleFunctionsFromBundle();
        return defaults(rules, [])
            .filter(ar => isFunction(allRules[ar.fnName]) && isFunction(allRules[ar.fnName].exec))
            .map(ar => ({...ar, fn: allRules[ar.fnName]}));
    }

    async _getRuleFunctionsFromBundle() {
        const bundleCode = await api.getLegacyRulesBundle();
        let ruleServiceLibraryInterfaceForSharingModules = {
            log: console.log,
            common: common,
            motherCalculations: motherCalculations,
            models: models
        };
        let rulesConfig = isEmpty(bundleCode)
            ? {}
            : evalRule(bundleCode.concat("rulesConfig;"));
        /**********/
        return {...rulesConfig};
    }

    async _getRules() {
        let newVar = await api.getLegacyRules();
        return newVar;
    }
}

let ruleService = new RuleService();
export default ruleService;