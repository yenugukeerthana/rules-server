import {
    ModelGeneral as General,
    Observation,
    Concept,
    ProgramEncounter,
    EncounterType,
    ConceptAnswer
} from "openchs-models";

const mapObservation = (objservationList) => {
    if (objservationList)
        return objservationList.map(observation => {
            return mapConcept(observation);
        });
};

const mapConceptAnswer = (conceptAnswer) => {
    if (conceptAnswer) {
        let mapConceptAnswer = {};
        for (let [key, value] of Object.entries(conceptAnswer)) {
            let conceptAnswer = new ConceptAnswer();
            conceptAnswer = mapConcept(value);
            conceptAnswer.uuid = value.uuid
            mapConceptAnswer[key] = conceptAnswer;
        }
        return mapConceptAnswer;
    }
};

const mapConcept = (observationJson) => {
    if (observationJson) {
        const observation = new Observation();
        const concept = General.assignFields(observationJson.concept, new Concept(), ["uuid", "name", "datatype"]);
        if (observationJson.concept.answers["0"] !== undefined) {
            concept.answers = mapConceptAnswer(observationJson.concept["answers"]);
        }
        let value;
        if (Array.isArray(observationJson.value) && concept.datatype === "Coded") {
            value = [];
            observationJson.value.forEach(observation => {
                value.push(concept.getValueWrapperFor(observationJson.valueJSON.answer));
            });
        } else if (concept.datatype === "Coded") {
            value = concept.getValueWrapperFor(observationJson.valueJSON.answer);
        } else {
            value = observationJson.valueJSON;
        }
        observation.concept = concept;
        observation.valueJSON = value;
        return observation;
    }
};

export const createEntity = (request) => {
    const entity = new ProgramEncounter();
    entity.uuid = request.uuid;
    entity.name = request.name;
    entity.encounterType = createEncounterType(request.encounterType);
    entity.earliestVisitDateTime = request.earliestVisitDateTime;
    entity.maxVisitDateTime = request.maxVisitDateTime;
    entity.encounterDateTime = request.encounterDateTime;
    entity.programEnrolment = null;
    // const ans = [{"concept":{"name":"Baby has got diarrohea","datatype":"Coded","uuid":"d7ae84be-0642-4e46-9d91-699574082abb","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"b0ef4333-5d9a-4f4a-83e6-81b1503b4039","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"6e1bad13-a896-4783-8f27-97e2e6780c58","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"04bb1773-c353-44a1-a68c-9b448e07ff70"}}];
    const ans = request.observations;
    entity.observations = mapObservation(ans);
    // entity.voided = false;
    return entity;
}

const createEncounterType = (encounterTypeParam) => {
    const encounterType = new EncounterType();
    encounterType.uuid = encounterTypeParam.uuid;
    encounterType.name = encounterTypeParam.name;
    encounterType.operationalEncounterTypeName = encounterTypeParam.operationalEncounterTypeName;
    encounterType.displayName = encounterTypeParam.displayName;
    return encounterType;
}