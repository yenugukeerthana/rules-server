import db from '../../server/db';

class BaseService {
    constructor(){
        this.db = db;
    }

    async findAllByKey(keyName, value, schemaName) {
        return await this.findAllByCriteria(`${keyName}='${value}'`, schemaName);
    }

    async findAllByCriteria(filterCriteria, schema) {
        return await this.db.any('SELECT * FROM '+ schema+ ' WHERE '+filterCriteria);
    }

    async findAll(schema = this.getSchema()) {
        return await this.db.any(`SELECT * FROM `+schema);
    }

    async findByKey(keyName, value, schemaName = this.getSchema()) {
        const entities = await this.findAllByKey(keyName, value, schemaName);
        console.log(`====> ${JSON.stringify(entities)}`)
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