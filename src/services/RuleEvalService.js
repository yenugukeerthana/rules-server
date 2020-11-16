import * as rulesConfig from 'rules-config';
import lodash, {isEmpty, forEach, reject, sortBy, get, isNil} from 'lodash';
import moment from 'moment';
import {
    common,
    encounterDecision,
    familyRegistrationDecision,
    individualRegistrationDecision,
    motherCalculations,
    programEncounterDecision,
    programEnrolmentDecision,
    RuleRegistry
} from "avni-health-modules";
import evalRule from "./evalRule";
import ruleService from "./RuleService";

const removeStrictFromRuleCode = (rule) => isNil(rule) ? "" : rule.replace(/"use strict";|'use strict';/ig, '');

export const decisionRule = async (rule, entity) => {
    const entityName = get(entity, "constructor.schema.name");
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };

    const trimDecisionsMap = (decisionsMap) => {
        const trimmedDecisions = {};
        forEach(decisionsMap, (decisions, decisionType) => {
            trimmedDecisions[decisionType] = reject(reject(decisions, isEmpty), (d) => isEmpty(d.value));
        });
        return trimmedDecisions;
    };

    const rulesFromTheBundle = await getAllRuleItemsFor(rule.formUuid, "Decision", "Form");

    let code = removeStrictFromRuleCode(rule.decisionCode);
    if (!_.isEmpty(_.trim(code))) {
        const ruleFunc = evalRule(code);
        const ruleDecisions = ruleFunc({
            params: {decisions: defaultDecisions, entity, common, motherCalculations},
            imports: {rulesConfig, lodash, moment}
        });
        const trimmedDecisions = trimDecisionsMap(ruleDecisions);
        return trimmedDecisions;
    } else if (!_.isEmpty(rulesFromTheBundle)) {
        const decisionsMap = rulesFromTheBundle.reduce((decisions, rule) => {
            return runRuleAndSaveFailure(rule, entityName, entity, decisions, new Date());
        }, defaultDecisions);
        const trimmedDecisions = trimDecisionsMap(decisionsMap);
        return trimmedDecisions;
    }
    return defaultDecisions;
}

export const visitScheduleRule = (rule, entity, scheduledVisits) => {
    let code = removeStrictFromRuleCode(rule.visitScheduleCode);
    if (isEmpty(code)) return scheduledVisits;
    const ruleFunc = evalRule(code);
    const nextVisits = ruleFunc({
        params: {visitSchedule: scheduledVisits, entity, common, motherCalculations},
        imports: {rulesConfig, lodash, moment}
    });
    return nextVisits;
}

export const checkListRule = (rule, entity, checklistDetails) => {
    const code = removeStrictFromRuleCode(rule.checklistCode);
    if (isEmpty(code)) return [];
    const ruleFunc = evalRule(code);
    const checklists = ruleFunc({
        params: {checklistDetails: checklistDetails, entity, common, motherCalculations},
        imports: {rulesConfig, lodash, moment}
    });
    return checklists;
};

const getAllRuleItemsFor = async (entityUuid, type, entityType) => {
    const applicableRules = RuleRegistry.getRulesFor(entityUuid, type, entityType); //Core module rules
    const additionalRules = await ruleService.getApplicableRules(entityUuid, type, entityType);
    const ruleItems = sortBy(applicableRules.concat(additionalRules), r => r.executionOrder);
    return ruleItems;
};

const runRuleAndSaveFailure = (rule, entityName, entity, ruleTypeValue, config, context) => {
    try {
        if (entityName === "WorkList") {
            ruleTypeValue = entity;
            return rule.fn.exec(entity, context);
        } else {
            return _.isNil(context)
                ? rule.fn.exec(entity, ruleTypeValue, config)
                : rule.fn.exec(entity, ruleTypeValue, context, config);
        }
    } catch (error) {
        console.log("Rule-Failure", `Rule failed: ${rule.name}, uuid: ${rule.uuid}`);
        //TODO: Implement saving rule failures by calling API
        // this.saveFailedRules(error, rule.uuid, this.getIndividualUUID(entity, entityName));
        return ruleTypeValue;
    }
};
