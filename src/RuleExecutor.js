import {createEntity} from './models/programEncounterModel';
import {mapEncounter} from './models/encounterModel';
import { mapProfile } from './models/individualModel';
import { mapProgramEnrolment } from './models/programEnrolmentModel';
import {decisionRule,visitScheduleRule} from './ruleEvaluation/decisionRule';

export const programEncounter = async (rule,request) => {
    return decisionRule(rule,createEntity(request));
}

export const encounter = async (rule,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(rule,mapEncounter(request));
        case 'VisitSchedule' :
                            const scheduleVisit = []; 
                            return visitScheduleRule(rule,mapEncounter(request),scheduleVisit);
    }
    
}

export const individualRegistration = async (rule,request) => {
    return decisionRule(rule,mapProfile(request));
}

export const programEnrolment = async (rule,request) => {
    switch(request.rule.ruleType){
        case 'Decision' : return decisionRule(rule,mapProgramEnrolment(request));
        case 'VisitSchedule' :
                            const scheduleVisit = []; 
                            return visitScheduleRule(rule,mapProgramEnrolment(request),scheduleVisit);
    }
}

