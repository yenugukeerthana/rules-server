import {
  Individual,
  ModelGeneral as General,
  Gender,
  AddressLevel,
  SubjectType
} from "openchs-models";
import { mapObservations } from "./observationModel";
import { mapEncounter } from "./encounterModel";

export const mapIndividual = individualDetails => {
  const individual = General.assignFields(
    individualDetails,
    new Individual(),
    ["uuid", "firstName", "lastName"],
    ["registrationDate","dateOfBirth"]
  );

  const subjectType = new SubjectType();
  subjectType.uuid = individualDetails.subjectType.uuid;
  subjectType.name = individualDetails.subjectType.name;
  individual.subjectType = subjectType;

  if(subjectType.isPerson()) {
    const gender = new Gender();
    gender.name = individualDetails.gender.name;
    gender.uuid = individualDetails.gender.uuid;
    individual.gender = gender;
  }

  const addressLevel = new AddressLevel();
  addressLevel.uuid = individualDetails.lowestAddressLevel.uuid;
  addressLevel.name = individualDetails.lowestAddressLevel.name;
  individual.lowestAddressLevel = addressLevel;

  individual.observations = mapObservations(individualDetails["observations"]);

  return individual;
};

//subject Dashboard profile Tab
export const mapProfile = subjectProfile => {
  if (subjectProfile) {
    let individual = mapIndividual(subjectProfile);
    if(subjectProfile["encounters"] != undefined){
      individual.encounters = subjectProfile["encounters"].map(encounters => {
        return mapEncounter(encounters);
      });
    }
    return individual;
  }
};