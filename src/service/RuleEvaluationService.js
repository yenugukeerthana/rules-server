export const validateDecisions = (decisionsMap, ruleUUID, individualUUID) => {
    return _.merge(..._.map(decisionsMap, (decisions, decisionType) => {
        return {
            [decisionType]: decisions
                .filter(decision => checkConceptForRule(decision.name, ruleUUID, individualUUID))
                .map(decision => filterValues(decision, ruleUUID, individualUUID))
        }
    }));
  }
  
 const checkConceptForRule = (conceptName, ruleUUID, individualUUID) => {
    try {
    //   console.log(conceptName, ruleUUID, individualUUID );
        // this.conceptService.findConcept(conceptName);
        return true;
    } catch (error) {
        // this.saveFailedRules(error, ruleUUID, individualUUID);
        return false;
    }
  }
  
  const filterValues = (decision, ruleUUID, individualUUID) => {
    // const nameConcept = this.conceptService.findConcept(decision.name);
    const nameConcept = 'Coded';
    decision.value = nameConcept.datatype !== 'Coded' ? decision.value : decision.value.filter(conceptName => checkConceptForRule(conceptName, ruleUUID, individualUUID));
    return decision;
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