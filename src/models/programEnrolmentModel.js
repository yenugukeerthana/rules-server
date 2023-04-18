import {
    ModelGeneral as General,
    ProgramEnrolment,
} from "openchs-models";
import {mapObservations} from "./observationModel";
import {mapIndividual} from "./individualModel";
import {mapProgramEncounter} from "./programEncounterModel";
import {mapEntityApprovalStatuses} from "./entityApprovalStatusModel";

export const mapProgramEnrolment = (request) => {
    const programEnrolment = General.assignFields(
        request,
        new ProgramEnrolment(),
        ["uuid", "voided"],
        ["enrolmentDateTime", "programExitDateTime"]
    );
    programEnrolment.approvalStatuses = mapEntityApprovalStatuses(request.entityApprovalStatuses);
    programEnrolment.voided = request.voided;
    if (request.observations) {
        programEnrolment.observations = mapObservations(request.observations);
    }
    if (request.exitObservations) {
        programEnrolment.programExitObservations = mapObservations(request.exitObservations);
    }
    if (request.subject) {
        programEnrolment.individual = mapIndividual(request.subject);
    }
    if (request.programEncounters) {
        programEnrolment.encounters = request.programEncounters.map(programEncounter => mapProgramEncounter(programEncounter));
    }
    return programEnrolment;
};
