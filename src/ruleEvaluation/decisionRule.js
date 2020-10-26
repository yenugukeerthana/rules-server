import * as rulesConfig from 'rules-config';
import lodash, {isEmpty, forEach, reject} from 'lodash';
import moment from 'moment';
import safeEval from 'safe-eval';
import * as models from "openchs-models";
import {common, motherCalculations} from "avni-health-modules";

const ruleServiceLibraryInterfaceForSharingModules = {
    log: console.log,
    common: common,
    motherCalculations: motherCalculations,
    models: models
};

const removeStrictFromRuleCode = (rule) => rule.replace(/"use strict";|'use strict';/ig, '');

const context = {console, ruleServiceLibraryInterfaceForSharingModules, _: lodash};

export const decisionRule = (rule, entity) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
    let code = removeStrictFromRuleCode(rule);
    if (isEmpty(code)) return defaultDecisions;
    const ruleFunc = safeEval(code, context);
    const ruleDecisions = ruleFunc({
        params: {decisions: defaultDecisions, entity, common, motherCalculations},
        imports: {rulesConfig, lodash, moment}
    });
    const trimDecisionsMap = (decisionsMap) => {
        const trimmedDecisions = {};
        forEach(decisionsMap, (decisions, decisionType) => {
            trimmedDecisions[decisionType] = reject(reject(decisions, isEmpty), (d) => isEmpty(d.value));
        });
        return trimmedDecisions;
    };
    const trimmedDecisions = trimDecisionsMap(ruleDecisions);
    return trimmedDecisions;
}

export const visitScheduleRule = (rule, entity, scheduledVisits) => {
    let code = removeStrictFromRuleCode(rule);
    if (isEmpty(code)) return scheduledVisits;
    const ruleFunc = safeEval(code, context);
    const nextVisits = ruleFunc({
        params: {visitSchedule: scheduledVisits, entity, common, motherCalculations},
        imports: {rulesConfig, lodash, moment}
    });
    return nextVisits;
}

export const checkListRule = (rule, entity, checklistDetails) => {
    const code = removeStrictFromRuleCode(rule);
    if (isEmpty(code)) return [];
    const ruleFunc = safeEval(code, context);
    const checklists = ruleFunc({
        params: {checklistDetails: checklistDetails, entity, common, motherCalculations},
        imports: {rulesConfig, lodash, moment}
    });
    return checklists;
};
