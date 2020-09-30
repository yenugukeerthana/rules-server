import * as rulesConfig from 'rules-config';
import lodash from 'lodash';
import moment from 'moment';
import safeEval from 'safe-eval';

const removeStrictFromRuleCode = (rule) => rule.replace(/"use strict";/ig, '');

const context = {console};

export const decisionRule = async (rule,entity) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
    const ruleFunc = safeEval(removeStrictFromRuleCode(rule), context);
    const ruleDecisions = ruleFunc({
        params: {decisions: defaultDecisions, entity},
        imports: {rulesConfig, lodash, moment}
    });
    return ruleDecisions;
}

export const visitScheduleRule = async (rule,entity,scheduledVisits) => {
    const ruleFunc = safeEval(removeStrictFromRuleCode(rule), context);
    const nextVisits = ruleFunc({
        params: { visitSchedule: scheduledVisits, entity },
        imports: { rulesConfig, lodash, moment }
    });
    return nextVisits;
}

export const checkListRule = async (rule,entity) => {
    const allChecklistDetails = JSON.parse('[{"uuid":"123-3454-56756-789","name":"Vaccination","items":[{"uuid":"123-456-789-5456"}]}]');
    const ruleFunc = safeEval(removeStrictFromRuleCode(rule), context);
    const nextVisits = ruleFunc({
        params: { checklistDetails: allChecklistDetails, entity },
        imports: { rulesConfig, lodash, moment }
    });
    return nextVisits;
}
