import {mapProgramEncounter} from './models/programEncounterModel';
import {mapEncounter} from './models/encounterModel';
import {mapIndividual} from './models/individualModel';
import {mapProgramEnrolment} from './models/programEnrolmentModel';
import {decisionRule, visitScheduleRule} from './ruleEvaluation/decisionRule';

const transformVisitScheduleDates = (visitSchedules) => {
    visitSchedules.forEach((visitSchedule, index, array) => {
        array[index].maxDate = visitSchedule.maxDate ? new Date(visitSchedule.maxDate).getTime() : null;
        array[index].earliestDate = visitSchedule.earliestDate ? new Date(visitSchedule.earliestDate).getTime() : null;
    });
    return visitSchedules;
}

const decisionCode = (requestBody) => requestBody.rule.decisionCode;
const visitScheduleCode = (requestBody) => requestBody.rule.visitScheduleCode;

const mappers = {
    "Individual": mapIndividual,
    "ProgramEnrolment": mapProgramEnrolment,
    "ProgramEncounter": mapProgramEncounter,
    "Encounter": mapEncounter
}

export const executeRule = (requestBody) => {
    const mapper = mappers[requestBody.rule.workFlowType];
    if (!mapper)
        throw new Error("Value of workFlowType param is invalid");
    return {
        "decisions": decisionRule(decisionCode(requestBody), mapper(requestBody)),
        "visitSchedules": transformVisitScheduleDates(visitScheduleRule(visitScheduleCode(requestBody), mapper(requestBody), requestBody.visitSchedules))
    }
}

