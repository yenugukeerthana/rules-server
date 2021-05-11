import * as rulesConfig from 'rules-config';
import lodash, {forEach, get, isEmpty, isNil, reject, sortBy} from 'lodash';
import moment from 'moment';
import {common, motherCalculations, RuleRegistry} from "avni-health-modules";
import evalRule from "./evalRule";
import ruleService from "./RuleService";
import {individualService} from "./IndividualService";

const removeStrictFromRuleCode = (rule) => isNil(rule) ? "" : rule.replace(/"use strict";|'use strict';/ig, '');

const trimDecisionsMap = (decisionsMap) => {
    const trimmedDecisions = {};
    forEach(decisionsMap, (decisions, decisionType) => {
        trimmedDecisions[decisionType] = reject(reject(decisions, isEmpty), (d) => isEmpty(d.value));
    });
    return trimmedDecisions;
};

const services = {
    individualService,
};

export const decisionRule = async (rule, entity) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
    const entityName = get(entity, "constructor.schema.name");
    const code = removeStrictFromRuleCode(rule.decisionCode);
    const rulesFromTheBundle = await getAllRuleItemsFor(rule.formUuid, "Decision", "Form");
    if (!_.isEmpty(_.trim(code))) {
        const ruleFunc = evalRule(code);
        const ruleDecisions = ruleFunc({
            params: {decisions: defaultDecisions, entity, common, motherCalculations, services},
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
};

export const visitScheduleRule = async (rule, entity, scheduledVisits) => {
    const entityName = get(entity, "constructor.schema.name");
    const code = removeStrictFromRuleCode(rule.visitScheduleCode);
    const rulesFromTheBundle = await getAllRuleItemsFor(rule.formUuid, "VisitSchedule", "Form");

    if (!isEmpty(code)) {
        const ruleFunc = evalRule(code);
        const nextVisits = ruleFunc({
            params: {visitSchedule: scheduledVisits, entity, common, motherCalculations, services},
            imports: {rulesConfig, lodash, moment}
        });
        return nextVisits;
    } else if (!isEmpty(rulesFromTheBundle)) {
        const nextVisits = rulesFromTheBundle
            .reduce((schedule, rule) => {
                console.log(`RuleEvaluationService`, `Executing Rule: ${rule.name} Class: ${rule.fnName}`);
                return runRuleAndSaveFailure(rule, entityName, entity, schedule);
            }, scheduledVisits);
        console.log("RuleEvaluationService - Next Visits", nextVisits);
        return nextVisits;
    }
    return scheduledVisits;
};

export const checkListRule = async (rule, entity, checklistDetails) => {
    const entityName = get(entity, "constructor.schema.name");
    const code = removeStrictFromRuleCode(rule.checklistCode);
    const rulesFromTheBundle = await getAllRuleItemsFor(rule.formUuid, "Checklists", "Form");

    if (!isEmpty(code)) {
        const ruleFunc = evalRule(code);
        const checklists = ruleFunc({
            params: {checklistDetails: checklistDetails, entity, common, motherCalculations, services},
            imports: {rulesConfig, lodash, moment}
        });

        return checklists;
    } else if (!isEmpty(rulesFromTheBundle)) {
        const allChecklists = rulesFromTheBundle
            .reduce((checklists, rule) => runRuleAndSaveFailure(rule, entityName, entity, checklistDetails), []);
        return allChecklists;
    }
    return [];
};

export const programSummaryRule = async (rule, entity) => {
    const entityName = get(entity, "constructor.schema.name");
    const code = removeStrictFromRuleCode(rule.programSummaryCode);
    const rulesFromTheBundle = await getAllRuleItemsFor(rule.formUuid, "EnrolmentSummary", "Program");
    if (!isEmpty(code)) {
        const ruleFunc = evalRule(code);
        let summaries = ruleFunc({
            params: {summaries: [], programEnrolment: entity, services},
            imports: {rulesConfig, lodash, moment}
        });
        return summaries;
    } else if (!isEmpty(rulesFromTheBundle)) {
        const summaries = rulesFromTheBundle
            .reduce((summaries, rule) => runRuleAndSaveFailure(rule, entityName, entity, summaries, new Date()), []);
        return summaries;
    }
    return [];
};

export const subjectSummaryRule = async (rule, entity) => {
    const code = removeStrictFromRuleCode(rule.subjectSummaryCode);
    if (!isEmpty(code)) {
        const ruleFunc = evalRule(code);
        let summaries = ruleFunc({
            params: {summaries: [], individual: entity, services},
            imports: {rulesConfig, lodash, moment}
        });
        return summaries;
    }
    return [];
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
        return ruleTypeValue;
    }
};
