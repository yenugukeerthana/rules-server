import conceptService from '../service/ConceptService';

export const validateDecisions = (decisionsMap, ruleUUID, individualUUID) => {
    return _.merge(..._.map(decisionsMap, (decisions, decisionType) => {
        return {
            [decisionType]: decisions
                .filter(decision => {
                   let data = checkConceptForRule(decision.name, ruleUUID, individualUUID);
                   console.log("$$$$$$$$$$$$",data);
                   return data
                })
                // .map(decision => filterValues(decision.value, ruleUUID, individualUUID))
        }
    }));
  }
  
 const checkConceptForRule = (conceptName, ruleUUID, individualUUID) => {
    // return conceptService.findConcept(conceptName)
    // .then(function (data) {
    //     return true;
    // })
    // .catch(function (err) {
    // // this.saveFailedRules(error, ruleUUID, individualUUID); -- need to insert entry in table
    // console.log(`No concept found for ${conceptName}`);
    // return false;
    // });
    try {
    //   console.log(conceptName, ruleUUID, individualUUID );
        conceptService.findConcept(conceptName);
        return true;
        } catch (error) {
            console.log("IN Error");
         // this.saveFailedRules(error, ruleUUID, individualUUID);
        return false;
        }
        
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