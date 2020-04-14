import lodash from 'lodash';
import moment from 'moment';
import * as rulesConfig from 'rules-config';
import {validateDecisions, trimDecisionsMap} from './service/RuleEvaluationService';
import {createEntity} from './models/programEncounterModels';
import { mapProfile } from './models/individualModel';

export const programEnocunter = async (rule,request) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
    const ruleFunc = eval(rule);
    const entity = createEntity(request);
    const ruleDecisions = ruleFunc({
        params: {decisions: defaultDecisions, entity},
        imports: {rulesConfig, lodash, moment}
    });
    const decisionsMap = await validateDecisions(ruleDecisions, request);
    const trimmedDecisions = await trimDecisionsMap(decisionsMap);
    return trimmedDecisions;
}

export const individualRegistration = async (rule,request) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
    const ruleFunc = eval(rule);
    const entity = mapProfile(request);
    const ruleDecisions = ruleFunc({
        params: {decisions: defaultDecisions, entity},
        imports: {rulesConfig, lodash, moment}
    });
    return ruleDecisions;
}