import {
    ProgramEnrolment,
} from "openchs-models";
import {mapObservation} from "./observationModel";
import { mapProfile } from "./individualModel";

export const mapProgramEnrolment = (request) => {
    const programEnrolment = new ProgramEnrolment();
    programEnrolment.uuid = request.uuid;
    programEnrolment.enrolmentDateTime = request.enrolmentDateTime;
    programEnrolment.programExitDateTime = request.programExitDateTime;
    programEnrolment.voided = request.voided;
    if(request.observations != undefined){
        programEnrolment.observations = mapObservation(request.observations);
    }
    if(request.exitObservations != undefined){
        programEnrolment.programExitObservations = mapObservation(request.exitObservations);
    }
    if(request.subject != undefined){    
        programEnrolment.individual = mapProfile(request.subject);
    }
    return programEnrolment;
}