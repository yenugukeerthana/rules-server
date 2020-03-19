import BaseService from "./BaseService";
// import {regeneratorRuntime,mark} from "@babel/plugin-transform-regenerator";

class ConceptService extends BaseService{

    findConcept(name){
    // findConcept = async (name) => {
        const concept =   this.findByKey('name', name, 'concept')
        .then(function (data) {
            console.log(data);
            return data;
        })
        .catch(function (err) {
        // this.saveFailedRules(error, ruleUUID, individualUUID); -- need to insert entry in table
        // console.log(`No concept found for ${conceptName}`);
        // return false;
            // throw Error(`No concept found for ${name}`);
            throw new Error('something bad happened');
        });
        // console.log(concept);
        // if (_.isNil(concept))
        //     throw Error(`No concept found for ${name}`);
        console.log("okok");
    }
}

export default new ConceptService();