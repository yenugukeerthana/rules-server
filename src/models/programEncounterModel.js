import {
    ProgramEncounter,
    EncounterType, ModelGeneral as General,
} from "openchs-models";
import {mapObservations} from "./observationModel";
import {mapProgramEnrolment} from "./programEnrolmentModel";
import {mapEntityApprovalStatus} from "./entityApprovalStatusModel";

export const mapProgramEncounter = (request) => {
    const programEncounter = General.assignFields(
        request,
        new ProgramEncounter(),
        ["uuid", "name", "voided"],
        ["encounterDateTime", "earliestVisitDateTime", "maxVisitDateTime", "cancelDateTime"]
    );
    programEncounter.encounterType = mapEncounterType(request.encounterType);
    programEncounter.programEnrolment = null;
    if (request.observations) {
        programEncounter.observations = mapObservations(request.observations);
        console.log(`programEncounterModel: observations ${JSON.stringify(programEncounter.observations)}`);
    }
    if (request.cancelObservations) {
        programEncounter.cancelObservations = mapObservations(request.cancelObservations);
    }
    if (request.programEnrolment) {
        programEncounter.programEnrolment = mapProgramEnrolment(request.programEnrolment);
    }
    programEncounter.latestEntityApprovalStatus = mapEntityApprovalStatus(request.latestEntityApprovalStatus);
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
