import {createEntity} from './models/programEncounterModels';
import { mapProfile } from './models/individualModel';
import { mapProgramEnrolment } from './models/programEnrolmentModels';
import {decisionRule} from './ruleEvaluation/decisionRule';

export const programEnocunter = async (rule,request) => {
    return decisionRule(rule,createEntity(request));
}

export const individualRegistration = async (rule,request) => {
    return decisionRule(rule,mapProfile(request));
}

export const programEnrolment = async (rule,request) => {
    return decisionRule(rule,mapProgramEnrolment(request));
}