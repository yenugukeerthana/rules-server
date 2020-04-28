import {
    ModelGeneral as General,
    Observation,
    Concept,
    ConceptAnswer
} from "openchs-models";

export const mapObservation = (objservationList) => {
    if (objservationList)
        return objservationList.map(observation => {
            return mapConcept(observation);
        });
};

const mapConceptAnswer = (conceptAnswer) => {
  if (conceptAnswer) {
      let mapConceptAnswer = {};
      for (let [key, value] of Object.entries(conceptAnswer)) {
          let conceptAnswer = new ConceptAnswer();
          conceptAnswer = mapAnswerConceptObs(value);
          mapConceptAnswer[key] = conceptAnswer;
      }
      return mapConceptAnswer;
  }
};

const mapAnswerConceptObs = (observationJson) => {
    if (observationJson) {
        const observation = new Observation();
        const concept = General.assignFields(observationJson, new Concept(), ["uuid", "name"]);
        concept.datatype = observationJson["dataType"];
          observation.concept = concept;
          return observation;  
    }
};

const mapConcept = (observationJson) => {
    if (observationJson) {
        const observation = new Observation();
        const concept = General.assignFields(observationJson.concept, new Concept(), ["uuid", "name"]);
        concept.datatype = observationJson.concept["dataType"];
        if (observationJson.concept["answers"] != undefined) {
          concept.answers = mapConceptAnswer(observationJson.concept["answers"]);
        }
        observation.concept = concept;
        observation.valueJSON = JSON.stringify(concept.getValueWrapperFor(observationJson.value));
        return observation;  
    }
};
