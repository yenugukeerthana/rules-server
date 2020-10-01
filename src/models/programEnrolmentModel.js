import {
    ProgramEnrolment,
} from "openchs-models";
import {mapObservations} from "./observationModel";
import { mapIndividual } from "./individualModel";
import { mapProgramEncounter } from "./programEncounterModel";

export const mapProgramEnrolment = (request) => {
    const programEnrolment = new ProgramEnrolment();
    programEnrolment.uuid = request.uuid;
    programEnrolment.enrolmentDateTime = request.enrolmentDateTime;
    programEnrolment.programExitDateTime = request.programExitDateTime;
    programEnrolment.voided = request.voided;
    console.log(`programEnrolmentModel: trying to set observations`);
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