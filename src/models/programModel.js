import {Program} from "openchs-models";

export const createProgram = (programParam) => {
    const program = new Program();
    program.uuid = programParam.uuid;
    program.name = programParam.name;
    program.voided = programParam.voided;
    program.entityEligibilityCheckRule = programParam.entityEligibilityCheckRule;
    program.active = programParam.active;
    return program;
};