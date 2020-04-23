import {
  Individual,
  ModelGeneral as General,
  Observation,
  Concept,
  ConceptAnswer,
  Gender,
  AddressLevel,
  SubjectType
} from "openchs-models";

export const mapIndividual = individualDetails => {
  const individual = General.assignFields(
    individualDetails,
    new Individual(),
    ["uuid", "firstName", "lastName", "dateOfBirth"],
    ["registrationDate"]
  );
  const gender = new Gender();
  gender.name = individualDetails.gender;
  gender.uuid = individualDetails.genderUUID;
  individual.gender = gender;

  const subjectType = new SubjectType();
  subjectType.uuid = individualDetails.subjectType.uuid;
  subjectType.name = individualDetails.subjectType.name;
  individual.subjectType = subjectType;

  // const addressLevel = new AddressLevel();
  // addressLevel.uuid = individualDetails.addressLevelUUID;
  // addressLevel.name = individualDetails.addressLevel;
  // individual.lowestAddressLevel = addressLevel;

  return individual;
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

//subject Dashboard profile Tab
export const mapProfile = subjectProfile => {
  if (subjectProfile) {
    let individual = mapIndividual(subjectProfile);
    individual.observations = mapObservation(subjectProfile["observations"]);
    return individual;
  }
};