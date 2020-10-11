import {mapProgramEncounter} from './models/programEncounterModel';
import {mapEncounter} from './models/encounterModel';
import { mapIndividual } from './models/individualModel';
import { mapProgramEnrolment } from './models/programEnrolmentModel';
import {decisionRule,visitScheduleRule,checkListRule} from './ruleEvaluation/decisionRule';

const transformVisitScheduleDates = (visitSchedules) => {
    visitSchedules.forEach((visitSchedule, index, array) => {
        array[index].maxDate = visitSchedule.maxDate ? new Date(visitSchedule.maxDate).getTime(): null;
        array[index].earliestDate = visitSchedule.earliestDate ? new Date(visitSchedule.earliestDate).getTime():null;
    });
    return visitSchedules;
}

export const programEncounter = async (ruleCode,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(ruleCode,mapProgramEncounter(request));
        case 'VisitSchedule' : return transformVisitScheduleDates(await visitScheduleRule(ruleCode,mapProgramEncounter(request),request.visitSchedules));
    }
}

export const encounter = async (ruleCode,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(ruleCode,mapEncounter(request));
        case 'VisitSchedule' : return transformVisitScheduleDates(await visitScheduleRule(ruleCode,mapEncounter(request),request.visitSchedules));
    }
    
}

export const individualRegistration = async (ruleCode,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(ruleCode, mapIndividual(request));
        case 'VisitSchedule' : return transformVisitScheduleDates(await visitScheduleRule(ruleCode, mapIndividual(request),request.visitSchedules));
    }

}

export const programEnrolment = async (ruleCode,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(ruleCode,mapProgramEnrolment(request));
        case 'VisitSchedule' : return transformVisitScheduleDates(await visitScheduleRule(ruleCode,mapProgramEnrolment(request),request.visitSchedules));
        case 'CheckList' : return checkListRule(ruleCode,mapProgramEnrolment(request));
    }
}

