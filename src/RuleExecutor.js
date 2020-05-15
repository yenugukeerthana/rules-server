import {createEntity} from './models/programEncounterModel';
import {mapEncounter} from './models/encounterModel';
import { mapProfile } from './models/individualModel';
import { mapProgramEnrolment } from './models/programEnrolmentModel';
import {decisionRule,visitScheduleRule} from './ruleEvaluation/decisionRule';

export const programEncounter = async (rule,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(rule,createEntity(request));
        case 'VisitSchedule' : 
                let data = visitScheduleRule(rule,createEntity(request),request.visitSchedules);
                return [...await data, ... request.visitSchedules];
    }
}

export const encounter = async (rule,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(rule,mapEncounter(request));
        case 'VisitSchedule' : return visitScheduleRule(rule,mapEncounter(request),request.visitSchedules);
    }
    
}

export const individualRegistration = async (rule,request) => {
    return decisionRule(rule,mapProfile(request));
}

export const programEnrolment = async (rule,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(rule,mapProgramEnrolment(request));
        case 'VisitSchedule' : 
                let data = visitScheduleRule(rule,mapProgramEnrolment(request),request.visitSchedules);
                return [...await data, ... request.visitSchedules];
    }
}

