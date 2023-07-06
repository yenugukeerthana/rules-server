import api from "./api";
import {map} from 'lodash';
import {mapIndividual} from "../models/individualModel";

class IndividualService {

    constructor() {
    }

    getSubjectsInLocation(addressLevel, subjectTypeName) {
       return api.getSubjects(addressLevel.uuid, subjectTypeName)
           .then(subjects => map(subjects, subject => mapIndividual(subject)));
    }

    getSubjectByUUID(uuid) {
        return api.getSubjectByUUID(uuid);
    }

}

export const individualService = new IndividualService();
