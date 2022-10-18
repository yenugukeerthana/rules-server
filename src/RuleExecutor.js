import {mapProgramEncounter} from './models/programEncounterModel';
import {createEncounterType, mapEncounter} from './models/encounterModel';
import {mapIndividual} from './models/individualModel';
import {mapProgramEnrolment} from './models/programEnrolmentModel';
import {
    checkListRule,
    decisionRule,
    isEligibleForEncounter,
    programSummaryRule,
    subjectSummaryRule,
    visitScheduleRule,
    scheduleRule
} from './services/RuleEvalService';
import {map} from 'lodash';

export const transformVisitScheduleDates = (visitSchedules) => {
    visitSchedules.forEach((visitSchedule, index, array) => {
        array[index].maxDate = visitSchedule.maxDate ? new Date(visitSchedule.maxDate).getTime() : null;
        array[index].earliestDate = visitSchedule.earliestDate ? new Date(visitSchedule.earliestDate).getTime() : null;
    });
    return visitSchedules;
}
const mappers = {
    "Individual": mapIndividual,
    "ProgramEnrolment": mapProgramEnrolment,
    "ProgramEncounter": mapProgramEncounter,
    "Encounter": mapEncounter,
    "ProgramSummary": mapProgramEnrolment,
    "SubjectSummary": mapIndividual,
}

const summaryRule = {
    "ProgramSummary": programSummaryRule,
    "SubjectSummary": subjectSummaryRule,
};

export const executeRule = async (requestBody) => {
    const mapEntity = mappers[requestBody.rule.workFlowType];
    if (!mapEntity)
        throw new Error("Value of workFlowType param is invalid");
    const entity = mapEntity(requestBody);
    return {
        "decisions": await decisionRule(requestBody.rule, entity),
        "visitSchedules": transformVisitScheduleDates(await visitScheduleRule(requestBody.rule, entity, requestBody.visitSchedules)),
        "checklists": await checkListRule(requestBody.rule, entity, requestBody.checklistDetails)
    }
}

export const executeSummaryRule = async (requestBody) => {
    const workflowType = requestBody.rule.workFlowType;
    const mapEntity = mappers[workflowType];
    if (!mapEntity)
        throw new Error("Value of workFlowType param is invalid");
    const entity = mapEntity(requestBody);
    return {
        "summaries": await summaryRule[workflowType](requestBody.rule, entity)
    }
};

export const executeEncounterEligibilityRule = async (requestBody) => {
    const {individual, encounterTypes} = requestBody;
    const individualModel = mapIndividual(individual);
    const eligibilityRuleEntities = await Promise.all(map(encounterTypes, et => isEligibleForEncounter(individualModel, createEncounterType(et))));
    return {eligibilityRuleEntities};
};

export const executeScheduleRule = async (requestBody) => {
    const {scheduleRule: rule} = requestBody;
    const individualModel = mapIndividual(requestBody.entity);

    return await scheduleRule(rule, individualModel);
}

