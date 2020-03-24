import BaseService from "./BaseService";
import { v4 as uuidv4 } from 'uuid';
// import {regeneratorRuntime,mark} from "@babel/plugin-transform-regenerator";

class ConceptService extends BaseService{

    async findConcept(name){
        const concept = await this.findByKey('name', name, 'concept');
        if (!concept)
            throw Error(`No concept found for ${name}`);
        return concept;
    }

    addRuleFailureTelemetric(ruleUUID, individualUUID,error){
        const req = {};
        req.uuid = uuidv4();
        req.user_id = 3;
        req.organisation_id = 2;
        req.rule_uuid = ruleUUID;
        req.individual_uuid = individualUUID;
        req.error_message = error.message;
        req.stacktrace = error.stack;
        req.error_date_time = '2020-03-16 15:51:51.188+05:30';
        req.is_closed = 'FALSE';
        const sql = "insert into rule_failure_telemetry(uuid,user_id,organisation_id,rule_uuid,individual_uuid,error_message,stacktrace,error_date_time,is_closed) values (${uuid},${user_id},${organisation_id},${rule_uuid},${individual_uuid},${error_message},${stacktrace},${error_date_time},${is_closed})";
        this.db.none(sql,req);
    }
}

export default new ConceptService();