import {
    ProgramEnrolment,
} from "openchs-models";
import {mapObservation} from "./observationModel";
import { mapProfile } from "./individualModel";
import { createEntity } from "./programEncounterModel";

export const mapProgramEnrolment = (request) => {
    const programEnrolment = new ProgramEnrolment();
    programEnrolment.uuid = request.uuid;
    programEnrolment.enrolmentDateTime = request.enrolmentDateTime;
    programEnrolment.programExitDateTime = request.programExitDateTime;
    programEnrolment.voided = request.voided;
    console.log(`programEnrolmentModel: trying to set observations`);
    if(request.observations != undefined){
        // console.log(`programEnrolmentModel: obs ${JSON.stringify(request.observations)}`);
        programEnrolment.observations = mapObservation(request.observations);
      console.log(`programEnrolmentModel: modal ${JSON.stringify(programEnrolment.observations)}`);
    }
    if(request.exitObservations != undefined){
        programEnrolment.programExitObservations = mapObservation(request.exitObservations);
    }
    if(request.subject != undefined){    
        programEnrolment.individual = mapProfile(request.subject);
    }
    if(request.programEncounters != undefined){
        programEnrolment.encounters = request.programEncounters.map(programEncounter => createEntity(programEncounter));
    }
    return programEnrolment;
}