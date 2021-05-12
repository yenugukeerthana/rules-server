import {AddressLevel, Gender, Individual, ModelGeneral as General, SubjectType} from "openchs-models";
import {mapObservations} from "./observationModel";
import {mapEncounter} from "./encounterModel";
import {mapEntityApprovalStatus} from "./entityApprovalStatusModel";
import {isEmpty, isNil, map} from 'lodash';
import {mapProgramEnrolment} from "./programEnrolmentModel";

export const mapIndividual = individualDetails => {
  const individual = General.assignFields(
    individualDetails,
    new Individual(),
    ["uuid", "firstName", "lastName"],
    ["registrationDate","dateOfBirth"]
  );

  const subjectType = mapSubjectType(individualDetails.subjectType);
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
  individual.latestEntityApprovalStatus = mapEntityApprovalStatus(individualDetails.latestEntityApprovalStatus);
  if (!isEmpty(individualDetails.encounters)) {
    individual.encounters = map(individualDetails.encounters, encounter => mapEncounter(encounter))
  }

  if (!isEmpty(individualDetails.enrolments)) {
    individual.enrolments = map(individualDetails.enrolments, enrolment => mapProgramEnrolment(enrolment))
  }

  return individual;
};

const mapSubjectType = request => {
  if (isNil(request)) {
    return new SubjectType();
  }
  return General.assignFields(request, new SubjectType(), ["uuid", "name", "type"]);
};
