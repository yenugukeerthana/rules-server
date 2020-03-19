import conceptService from '../service/ConceptService';
import _ from "lodash";

export const validateDecisions = async (decisionsMap, ruleUUID, individualUUID) => {
    return await _.merge(..._.map(decisionsMap, async (decisions, decisionType) => {
        return {
            [decisionType]: await decisions
                .filter(async decision => {
                    let data = await checkConceptForRule(decision.name, ruleUUID, individualUUID);
                    console.log("$$$$$$$$$$$$", data);
                    return data
                })
            // .map(decision => filterValues(decision.value, ruleUUID, individualUUID))
        }
    }));
}
  
 const checkConceptForRule = async (conceptName, ruleUUID, individualUUID) => {
     return await conceptService.findConcept(conceptName);
 }
  
  const filterValues = (decision, ruleUUID, individualUUID) => {
      console.log("IN Filter Values");
    conceptService.findConcept(decision)
    .then(function (nameConcept) {
        console.log(nameConcept);
        decision.value = nameConcept.datatype !== 'Coded' ? decision.value : decision.value.filter(conceptName => checkConceptForRule(conceptName, ruleUUID, individualUUID));
        return decision;
    })
  }
  
export const trimDecisionsMap = (decisionsMap) => {
    const trimmedDecisions = {};
    _.forEach(decisionsMap, (decisions, decisionType) => {
        trimmedDecisions[decisionType] = _.reject(decisions, _.isEmpty);
    });
    return trimmedDecisions;
  };
  
  function getIndividualUUID(entity, entityName){
    switch (entityName) {
        case 'Individual':
            return entity.uuid;
        case 'ProgramEnrolment':
            return entity.individual.uuid;
        case 'ProgramEncounter':
            return entity.programEnrolment.individual.uuid;
        case 'Encounter':
            return entity.individual.uuid;
        case 'WorkList':
            return entity.getCurrentWorkItem().parameters.subjectUUID;
        default:
            return "entity not mapped";
    }
  };