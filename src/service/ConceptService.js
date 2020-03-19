import BaseService from "./BaseService";

// import {regeneratorRuntime,mark} from "@babel/plugin-transform-regenerator";

class ConceptService extends BaseService{

    async findConcept(name){
        return await this.findByKey('name', name, 'concept');
    }
}

export default new ConceptService();