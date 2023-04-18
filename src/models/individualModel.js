import {AddressLevel, Gender, GroupSubject, Individual, ModelGeneral as General, SubjectType, GroupRole} from "openchs-models";
import {mapObservations} from "./observationModel";
import {mapEncounter} from "./encounterModel";
import {mapEntityApprovalStatuses} from "./entityApprovalStatusModel";
import {isNil, map} from 'lodash';
import {mapProgramEnrolment} from "./programEnrolmentModel";

function mapBasicSubject(individualDetails) {
    const individual = General.assignFields(
        individualDetails,
        new Individual(),
        ["uuid", "firstName", "lastName", "profilePicture", "voided"],
        ["registrationDate", "dateOfBirth"]
    );

    const subjectType = mapSubjectType(individualDetails.subjectType);
    individual.subjectType = subjectType;

    if (subjectType.isPerson()) {
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
}

export const mapIndividual = individualDetails => {
    const individual = mapBasicSubject(individualDetails);
    individual.approvalStatuses = mapEntityApprovalStatuses(individualDetails.entityApprovalStatuses);
    if (!isNil(individualDetails.encounters)) {
        individual.encounters = map(individualDetails.encounters, encounter => mapEncounter(encounter))
    } else {
        individual.encounters = [];
    }

    if (!isNil(individualDetails.enrolments)) {
        individual.enrolments = map(individualDetails.enrolments, enrolment => mapProgramEnrolment(enrolment))
    } else {
        individual.enrolments = [];
    }

    if (!isNil(individualDetails.groups)) {
        individual.groups = map(individualDetails.groups, groupSubject => mapGroupSubject(groupSubject))
    } else {
        individual.groups = [];
    }
    return individual;
};

const mapSubjectType = request => {
    if (isNil(request)) {
        return new SubjectType();
    }
    return General.assignFields(request, new SubjectType(), ["uuid", "name", "type"]);
};


const mapGroupSubject = resource => {
    const groupSubjectEntity = General.assignFields(
        resource,
        new GroupSubject(),
        ["uuid", "voided"],
        ["membershipStartDate", "membershipEndDate"]
    );
    const groupSubject = mapIndividual(resource.groupSubject);
    const memberSubject = mapIndividual(resource.memberSubject);
    const groupRole = mapGroupRole(resource.groupRole);
    groupSubjectEntity.groupSubject = groupSubject;
    groupSubjectEntity.memberSubject = memberSubject;
    groupSubjectEntity.groupRole = groupRole;
    return groupSubjectEntity;
};

const mapGroupRole = resource => {
    const groupSubjectType = mapSubjectType(resource.groupSubjectType);
    const memberSubjectType = mapSubjectType(resource.memberSubjectType);
    const groupRole = General.assignFields(resource, new GroupRole(), [
        "uuid",
        "role",
        "primary",
        "maximumNumberOfMembers",
        "minimumNumberOfMembers",
        "voided",
    ]);
    groupRole.groupSubjectType = groupSubjectType;
    groupRole.memberSubjectType = memberSubjectType;
    return groupRole;
};
