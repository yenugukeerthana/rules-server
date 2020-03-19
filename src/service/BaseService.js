import db from '../../server/db';

class BaseService {
    constructor(){
        this.db = db;
    }

    findAllByKey(keyName, value, schemaName) {
        return this.findAllByCriteria(`${keyName}='${value}'`, schemaName);
    }

    findAllByCriteria(filterCriteria, schema) {
        return this.db.any('SELECT * FROM '+ schema+ ' WHERE '+filterCriteria);
    }

    findAll(schema = this.getSchema()) {
        return this.db.any(`SELECT * FROM `+schema);
    }

    findByKey(keyName, value, schemaName = this.getSchema()) {
        const entities = this.findAllByKey(keyName, value, schemaName);
        return this.getReturnValue(entities);
    }

    getReturnValue(entities) {
        if (entities.length === 0) return undefined;
        if (entities.length === 1) return entities[0];
        return entities;
    }

    getSchema() {
        throw "SchemaName should be passed";
    }
}

export default BaseService;