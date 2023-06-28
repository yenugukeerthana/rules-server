import {
    ModelGeneral as General,
    Observation,
    Concept,
    ConceptAnswer
} from "openchs-models";

export const mapObservations = (objservationList) => {
    if (objservationList) {
        return objservationList.map(observation => {
            return mapObservation(observation);
        });
    }
};

const mapConceptAnswer = (conceptAnswers) => {
    return conceptAnswers.map((ca) => {
        const conceptAnswerModel = General.assignFields(ca, new ConceptAnswer(), ["uuid", "answerOrder", "abnormal", "unique"]);
        conceptAnswerModel.concept = mapConcept(ca.concept);
        return conceptAnswerModel;
    });
};

const mapConcept = (concept) => {
    const conceptModel = General.assignFields(concept, new Concept(), ["uuid", "name", "datatype", "hiAbsolute", "lowAbsolute", "keyValues", "lowNormal", "highNormal", "unit"]);
    if (concept["answers"]) {
        conceptModel.answers = mapConceptAnswer(concept["answers"]);
    }
    return conceptModel;
};

const mapObservation = (observationJson) => {
    if (observationJson) {
        const observation = new Observation();
        const concept = mapConcept(observationJson.concept);
        observation.concept = concept;
        if(concept.datatype === 'QuestionGroup') {
            let isRepeatable = _.isArray(_.get(observationJson, 'value[0]', null));
            if(!isRepeatable) {
                let groupObservationObject =  constructQuestionGroupObservation(observationJson.value);
                delete observationJson.value;
                observationJson.value = groupObservationObject;
            }
            else {
                let repeatableObservations = [];
                _.forEach(observationJson.value, (observation) => {
                    let repeatableObservation = constructQuestionGroupObservation(observation);
                    repeatableObservations.push(repeatableObservation);
                });

                delete observationJson.value;
                observationJson.value = {repeatableObservations: repeatableObservations};
            }
        }
        
        observation.valueJSON = JSON.stringify(concept.getValueWrapperFor(observationJson.value));
        return observation;
    }
};

const constructQuestionGroupObservation = (groupObservations) => {
    const questionGroupObservations = _.map(groupObservations, (groupObservation) => {
        groupObservation.valueJSON = {value: groupObservation.value};
        delete groupObservation.value;
        return groupObservation;
    });

    return {groupObservations: questionGroupObservations};
}