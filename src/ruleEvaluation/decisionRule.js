import * as rulesConfig from 'rules-config';
import lodash from 'lodash';
import moment from 'moment';
import safeEval from 'safe-eval';
import * as models from "openchs-models";
import { common, motherCalculations } from "avni-health-modules";

const ruleServiceLibraryInterfaceForSharingModules = {
    log: console.log,
    common: common,
    motherCalculations: motherCalculations,
    models: models
};

const removeStrictFromRuleCode = (rule) => rule.replace(/"use strict";/ig, '');

const context = {console, ruleServiceLibraryInterfaceForSharingModules, _: lodash};

export const decisionRule = async (rule,entity) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
    const ruleFunc = safeEval(removeStrictFromRuleCode(rule), context);
    const ruleDecisions = ruleFunc({
        params: {decisions: defaultDecisions, entity, common, motherCalculations},
        imports: {rulesConfig, lodash, moment}
    });
    return ruleDecisions;
}

export const visitScheduleRule = async (rule,entity,scheduledVisits) => {
    const ruleFunc = safeEval(removeStrictFromRuleCode(rule), context);
    const nextVisits = ruleFunc({
        params: { visitSchedule: scheduledVisits, entity, common, motherCalculations },
        imports: { rulesConfig, lodash, moment }
    });
    return nextVisits;
}

export const checkListRule = async (rule,entity) => {
    const allChecklistDetails = JSON.parse('[{"uuid":"123-3454-56756-789","name":"Vaccination","items":[{"uuid":"123-456-789-5456"}]}]');
    const ruleFunc = safeEval(removeStrictFromRuleCode(rule), context);
    const nextVisits = ruleFunc({
        params: { checklistDetails: allChecklistDetails, entity, common, motherCalculations },
        imports: { rulesConfig, lodash, moment }
    });
    return nextVisits;
}
