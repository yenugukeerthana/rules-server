import lodash from 'lodash';
import moment from 'moment';
import * as rulesConfig from 'rules-config';
import {validateDecisions, trimDecisionsMap} from './service/RuleEvaluationService';
import {createEntity} from './models/programEncounterModels';

export const programEnocunter = (text) => {
    const defaultDecisions = {
        "enrolmentDecisions": [],
        "encounterDecisions": [],
        "registrationDecisions": []
    };
  const ruleFunc = eval(text);
  const entity = createEntity();
  const ruleDecisions = ruleFunc({
      params: { decisions: defaultDecisions, entity },
      imports: { rulesConfig, lodash, moment }
  });
//   const decisionsMap = validateDecisions(ruleDecisions, "38a778be-991f-40f0-9837-7244836ecdfc", "35253eab-6594-4bad-9243-ca6ef15fc054");
//   const trimmedDecisions = trimDecisionsMap(decisionsMap);
  return ruleDecisions;
}