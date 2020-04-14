import {
  Individual,
  ModelGeneral as General,
  Observation,
  Concept,
  ConceptAnswer
} from "openchs-models";

// subject Dashboard common functionality
export const mapIndividual = individualDetails => {
  return General.assignFields(
    individualDetails,
    new Individual(),
    ["uuid", "firstName", "lastName", "dateOfBirth", "gender", "lowestAddressLevel"],
    ["registrationDate"]
  );
};
const mapObservation = (objservationList) => {
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
          conceptAnswer = mapConcept(value);
          conceptAnswer.uuid = value.uuid
          mapConceptAnswer[key] = conceptAnswer;
      }
      return mapConceptAnswer;
  }
};

const mapConcept = (observationJson) => {
    if (observationJson) {
        const observation = new Observation();
        const concept = General.assignFields(observationJson.concept, new Concept(), ["uuid", "name"]);
        concept.datatype = observationJson.concept["dataType"];
        if (observationJson.concept["answers"] !== undefined) {
          concept.answers = mapConceptAnswer(observationJson.concept["answers"]);
        }
        let value;
        if (Array.isArray(observationJson.value) && concept.datatype === "Coded") {
            value = [];
            observationJson.value.forEach(observation => {
                value.push(concept.getValueWrapperFor(observation.uuid));
            });
          } else if (concept.datatype === "Coded") {
            value = concept.getValueWrapperFor(observationJson.value.uuid);
          } else {
            value = observationJson.value;
          }
          observation.concept = concept;
          observation.valueJSON = value;
          return observation;  
    }
};

//subject Dashboard profile Tab
export const mapProfile = subjectProfile => {
  if (subjectProfile) {
    let individual = mapIndividual(subjectProfile);
    individual.observations = mapObservation(subjectProfile["observations"]);
    return individual;
  }
};