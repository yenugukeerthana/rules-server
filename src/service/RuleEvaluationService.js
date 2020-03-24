import conceptService from '../service/ConceptService';
import _ from "lodash";

export const validateDecisions = async (decisionsMap, ruleUUID, individualUUID) => {
    await Promise.all(_.map(decisionsMap, async (value, key) => {
        const finalDecisions = [];
        const decisions = decisionsMap[key];

        await Promise.all(decisions.map(async decision => {
            const nameConcept = await checkConceptForRule(decision.name, ruleUUID, individualUUID);
            if (nameConcept) {
                if (nameConcept["data_type"] === "Coded") {
                    const finalValue = [];
                    await Promise.all(decision.value.map(async answerConceptName => {
                        const answerConcept = await checkConceptForRule(answerConceptName, ruleUUID, individualUUID);
                        if (answerConcept) {
                            finalValue.push(answerConceptName);
                        }
                    }));
                    decision.value = finalValue;
                }
                finalDecisions.push(decision);
                console.log(`RuleEvaluationService: finalDecisions ${JSON.stringify(finalDecisions)}`);
            }
        }));
        console.log(`RuleEvaluationService: here`);

        decisionsMap[key] = finalDecisions;
    }));
    return decisionsMap;
}

const checkConceptForRule = async (conceptName, ruleUUID, individualUUID) => {
    try {
        const concept = await conceptService.findConcept(conceptName);
        return concept;
    } catch (error) {
        console.log(`RuleEvaluationService: error ${error}`);
        conceptService.addRuleFailureTelemetric(ruleUUID, individualUUID, error);
        return null;
    }
}

export const trimDecisionsMap = (decisionsMap) => {
    const trimmedDecisions = {};
    _.forEach(decisionsMap, (decisions, decisionType) => {
        trimmedDecisions[decisionType] = _.reject(decisions, _.isEmpty);
    });
    return trimmedDecisions;
};

function getIndividualUUID(entity, entityName) {
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