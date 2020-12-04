import {
    ModelGeneral as General,
    ProgramEnrolment,
} from "openchs-models";
import {mapObservations} from "./observationModel";
import { mapIndividual } from "./individualModel";
import { mapProgramEncounter } from "./programEncounterModel";

export const mapProgramEnrolment = (request) => {
    const programEnrolment = General.assignFields(
        request,
        new ProgramEnrolment(),
        ["uuid"],
        ["enrolmentDateTime", "programExitDateTime"]
    );
    programEnrolment.voided = request.voided;
    if(request.observations != undefined){
        programEnrolment.observations = mapObservations(request.observations);
    }
    if(request.exitObservations != undefined){
        programEnrolment.programExitObservations = mapObservations(request.exitObservations);
    }
    if(request.subject != undefined){
        //TODO: add encounters and enrolments to individual
        programEnrolment.individual = mapIndividual(request.subject);
    }
    if(request.programEncounters != undefined){
        programEnrolment.encounters = request.programEncounters.map(programEncounter => mapProgramEncounter(programEncounter));
    }
    return programEnrolment;
}
