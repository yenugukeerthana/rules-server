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

    addRuleFailureTelemetric(request,error){
        const req = {};
        req.uuid = uuidv4();
        req.user_id = request.userId;
        req.organisation_id = request.organisarionId;
        req.rule_uuid = request.ruleUuid;
        req.individual_uuid = request.individualUuid;
        req.error_message = error.message;
        req.stacktrace = error.stack;
        req.error_date_time = new Date().toISOString();
        req.is_closed = 'FALSE';
        const sql = "insert into rule_failure_telemetry(uuid,user_id,organisation_id,rule_uuid,individual_uuid,error_message,stacktrace,error_date_time,is_closed) values (${uuid},${user_id},${organisation_id},${rule_uuid},${individual_uuid},${error_message},${stacktrace},${error_date_time},${is_closed})";
        this.db.none(sql,req);
    }
}

export default new ConceptService();