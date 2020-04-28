import {
    ProgramEncounter,
    EncounterType,
} from "openchs-models";
import { mapObservation } from "./observationModel";

export const createEntity = (request) => {
    const entity = new ProgramEncounter();
    entity.uuid = request.uuid;
    entity.name = request.name;
    entity.encounterType = createEncounterType(request.encounterType);
    entity.earliestVisitDateTime = request.earliestVisitDateTime;
    entity.maxVisitDateTime = request.maxVisitDateTime;
    entity.encounterDateTime = request.encounterDateTime;
    entity.programEnrolment = null;
    entity.observations = mapObservation(request.observations);
    return entity;
}

const createEncounterType = (encounterTypeParam) => {
    const encounterType = new EncounterType();
    encounterType.uuid = encounterTypeParam.uuid;
    encounterType.name = encounterTypeParam.name;
    encounterType.operationalEncounterTypeName = encounterTypeParam.operationalEncounterTypeName;
    encounterType.displayName = encounterTypeParam.displayName;
    return encounterType;
}