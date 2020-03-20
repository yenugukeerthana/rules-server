import conceptService from '../service/ConceptService';
import _ from "lodash";
import Concept from 'openchs-models/dist/Concept';

export const validateDecisions = async (decisionsMap, ruleUUID, individualUUID) => {
    return await _.merge(..._.map(decisionsMap, async (decisions, decisionType) => {
        return {
            [decisionType]: await decisions
                .filter(async decision => {
                    let data = await checkConceptForRule(decision.name, ruleUUID, individualUUID);
                    console.log("IN FILTER", data);
                    return data
                })
            .map(async decision =>{ let fdata = await filterValues(decision, ruleUUID, individualUUID)
                console.log("IN MAP");
                return fdata;
            })
        }
    }));
}
  
 const checkConceptForRule = async (conceptName, ruleUUID, individualUUID) => {
    try{ 
        return await conceptService.findConcept(conceptName).then(function (data) {
            console.log(data);
            return true;
        });
    }catch(error){
        conceptService.addRuleFailureTelemetric(conceptName, ruleUUID, individualUUID,error);
        return false;
    }
 }
  
  const filterValues = async (decision, ruleUUID, individualUUID) => {
    try{ 
     return await conceptService.findConcept(decision.name)
        .then(function (conceptData) {
            const nameConcept = new Concept();
            nameConcept.datatype = conceptData["data_type"];
            // console.log(nameConcept);
            decision.value = nameConcept.datatype !== 'Coded' ? decision.value : decision.value.filter(conceptName => checkConceptForRule(conceptName, ruleUUID, individualUUID));
            return decision;
        })
    }catch(error){
        return false;
    }
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