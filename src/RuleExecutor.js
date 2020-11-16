import {mapProgramEncounter} from './models/programEncounterModel';
import {mapEncounter} from './models/encounterModel';
import {mapIndividual} from './models/individualModel';
import {mapProgramEnrolment} from './models/programEnrolmentModel';
import {checkListRule, decisionRule, visitScheduleRule} from './services/RuleEvalService';

const transformVisitScheduleDates = (visitSchedules) => {
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
    "Encounter": mapEncounter
}

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

