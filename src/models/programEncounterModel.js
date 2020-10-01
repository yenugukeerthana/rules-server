import {
    ProgramEncounter,
    EncounterType,
} from "openchs-models";
import { mapObservations } from "./observationModel";
import { mapProgramEnrolment } from "./programEnrolmentModel";

export const mapProgramEncounter = (request) => {
    const entity = new ProgramEncounter();
    entity.uuid = request.uuid;
    entity.name = request.name;
    entity.encounterType = mapEncounterType(request.encounterType);
    entity.earliestVisitDateTime = request.earliestVisitDateTime;
    entity.maxVisitDateTime = request.maxVisitDateTime;
    entity.encounterDateTime = request.encounterDateTime;
    entity.programEnrolment = null;
    console.log(`programEncounterModel: request.obs ${request.observations}`);
    if(request.observations != undefined){
        entity.observations = mapObservations(request.observations);
        console.log(`programEncounterModel: modal ${JSON.stringify(entity.observations)}`);
    }
    if(request.cancelObservations != undefined){
        entity.cancelObservations = mapObservations(request.cancelObservations);
    }
    if(request.programEnrolment != undefined){
        entity.programEnrolment = mapProgramEnrolment(request.programEnrolment);
    }
    return entity;
}

const mapEncounterType = (encounterTypeParam) => {
    const encounterType = new EncounterType();
    encounterType.uuid = encounterTypeParam.uuid;
    encounterType.name = encounterTypeParam.name;
    encounterType.operationalEncounterTypeName = encounterTypeParam.operationalEncounterTypeName;
    encounterType.displayName = encounterTypeParam.displayName;
    return encounterType;
}