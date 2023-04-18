import {EncounterType, ModelGeneral as General, ProgramEncounter,} from "openchs-models";
import {mapObservations} from "./observationModel";
import {mapProgramEnrolment} from "./programEnrolmentModel";
import {mapEntityApprovalStatuses} from "./entityApprovalStatusModel";

export const mapProgramEncounter = (request) => {
    const programEncounter = General.assignFields(
        request,
        ProgramEncounter.createEmptyInstance(),
        ["uuid", "name", "voided"],
        ["encounterDateTime", "earliestVisitDateTime", "maxVisitDateTime", "cancelDateTime"]
    );
    programEncounter.approvalStatuses = mapEntityApprovalStatuses(request.entityApprovalStatuses)
    programEncounter.encounterType = mapEncounterType(request.encounterType);
    programEncounter.programEnrolment = null;
    if (request.observations) {
        programEncounter.observations = mapObservations(request.observations);
    }
    if (request.cancelObservations) {
        programEncounter.cancelObservations = mapObservations(request.cancelObservations);
    }
    if (request.programEnrolment) {
        programEncounter.programEnrolment = mapProgramEnrolment(request.programEnrolment);
    }
    return programEncounter;
};

const mapEncounterType = (encounterTypeParam) => {
    const encounterType = new EncounterType();
    encounterType.uuid = encounterTypeParam.uuid;
    encounterType.name = encounterTypeParam.name;
    encounterType.operationalEncounterTypeName = encounterTypeParam.operationalEncounterTypeName;
    encounterType.displayName = encounterTypeParam.displayName;
    return encounterType;
};
