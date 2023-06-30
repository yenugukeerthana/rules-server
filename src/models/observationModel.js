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
    function mapQuestionGroupObservation(concept) {
        const constructQuestionGroupObservation = (groupObservations) => {
            const questionGroupObservations = _.map(groupObservations, (groupObservation) => {
                groupObservation.valueJSON = {value: groupObservation.value};
                delete groupObservation.value;
                return groupObservation;
            });

            return {groupObservations: questionGroupObservations};
        }

        function mapNonRepeatableQuestionGroupObservation() {
            let groupObservationObject = constructQuestionGroupObservation(observationJson.value);
            delete observationJson.value;
            observationJson.value = groupObservationObject;
        }

        function mapRepeatableQuestionGroupObservation() {
            let repeatableObservations = [];
            _.forEach(observationJson.value, (observation) => {
                let groupObservationObject = constructQuestionGroupObservation(observation);
                repeatableObservations.push(groupObservationObject);
            });

            delete observationJson.value;
            observationJson.value = {repeatableObservations: repeatableObservations};
        }

        if (concept.isQuestionGroup()) {
            let isRepeatable = _.isArray(_.get(observationJson, 'value[0]', null));
            isRepeatable ? mapRepeatableQuestionGroupObservation() : mapNonRepeatableQuestionGroupObservation();
        }
    }

    if (observationJson) {
        const observation = new Observation();
        const concept = mapConcept(observationJson.concept);
        observation.concept = concept;
        mapQuestionGroupObservation(concept);
        
        observation.valueJSON = JSON.stringify(concept.getValueWrapperFor(observationJson.value));
        return observation;
    }
};
