import conceptService from '../service/ConceptService';
import _ from "lodash";

export const validateDecisions = async (decisionsMap, request) => {
    await Promise.all(_.map(decisionsMap, async (value, key) => {
        const finalDecisions = [];
        const decisions = decisionsMap[key];

        await Promise.all(decisions.map(async decision => {
            const nameConcept = await checkConceptForRule(decision.name, request);
            if (nameConcept) {
                if (nameConcept["data_type"] === "Coded") {
                    const finalValue = [];
                    await Promise.all(decision.value.map(async answerConceptName => {
                        const answerConcept = await checkConceptForRule(answerConceptName, request);
                        if (answerConcept) {
                            finalValue.push(answerConceptName);
                        }
                    }));
                    decision.value = finalValue;
                }
                finalDecisions.push(decision);
            }
        }));

        decisionsMap[key] = finalDecisions;
    }));
    return decisionsMap;
}

const checkConceptForRule = async (conceptName, request) => {
    try {
        const concept = await conceptService.findConcept(conceptName);
        return concept;
    } catch (error) {
        console.log(`RuleEvaluationService: error ${error}`);
        conceptService.addRuleFailureTelemetric(request, error);
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