import BaseService from "./BaseService";

// import {regeneratorRuntime,mark} from "@babel/plugin-transform-regenerator";

class ConceptService extends BaseService{

    async findConcept(name){
        return await this.findByKey('name', name, 'concept');
    }

    addRuleFailureTelemetric(conceptName, ruleUUID, individualUUID,error){
        const req = {};
        req.uuid = 'e0d26c8b-6c33-4765-a8d5-a97370c3e06d';
        req.user_id = 3;
        req.organisation_id = 2;
        req.rule_uuid = ruleUUID;
        req.individual_uuid = individualUUID;
        req.error_message = error;
        req.stacktrace = '';
        req.error_date_time = '2020-03-16 15:51:51.188+05:30';
        req.is_closed = 'FALSE';
        const sql = "insert into rule_failure_telemetry(uuid,user_id,organisation_id,rule_uuid,individual_uuid,error_message,stacktrace,error_date_time,is_closed) values (${uuid},${user_id},${organisation_id},${rule_uuid},${individual_uuid},${error_message},${stacktrace},${error_date_time},${is_closed})";
        this.db.none(sql,req);
    }
}

export default new ConceptService();