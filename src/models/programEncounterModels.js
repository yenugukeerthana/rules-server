import {
    ModelGeneral as General,
    Observation,
    Concept,
    ProgramEncounter,
    EncounterType
  } from "openchs-models";

const mapObservation = (objservationList) => {
    if (objservationList)
      return objservationList.map(observation => {
        return mapConcept(observation);
      });
  };

const mapConcept = ( observationJson ) => {
    if (observationJson) {
      const observation = new Observation();
      const concept = General.assignFields(observationJson.concept, new Concept(), ["uuid", "name"]);
      concept.datatype = observationJson.concept["datatype"];
      let value;
      if (Array.isArray(observationJson.value) && concept.datatype === "Coded") {
        value = [];
        observationJson.value.forEach(observation => {
          value.push(JSON.stringify(concept.getValueWrapperFor(observationJson.value)));
        });
      } else if (concept.datatype === "Coded") {
        value = JSON.stringify(concept.getValueWrapperFor(observationJson.value));
      } else {
        value = observationJson.value;
      }
      observation.concept = concept;
      observation.valueJSON = value;
      return observation;
    }
  };
  
  
  
export const createEntity = () => {
    const entity = new ProgramEncounter();
  entity.uuid = '387f74a3-829f-4b6e-8995-ab5b0e211669';
  entity.name = null;
  entity.encounterType = createEncounterType();
  entity.earliestVisitDateTime = null;
  entity.maxVisitDateTime = null;
  entity.encounterDateTime = "2020-02-11T05:00:00.000Z";
  entity.programEnrolment = null;
  entity.observations = mapObservation([{"concept":{"name":"Whether having cough and cold","datatype":"Coded","uuid":"e6bd3ca9-caed-462a-bf7a-1614269ebeaa","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"48a55b75-2ff9-440a-84fb-795d29f97a75","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"b1b5da7b-50b6-4c02-b933-03bd2975145a","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}},{"concept":{"name":"Baby has got diarrohea","datatype":"Coded","uuid":"d7ae84be-0642-4e46-9d91-699574082abb","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"b0ef4333-5d9a-4f4a-83e6-81b1503b4039","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"6e1bad13-a896-4783-8f27-97e2e6780c58","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}},{"concept":{"name":"Is current weight of the child equal to or less than the previous months weight?","datatype":"Coded","uuid":"158d59f3-5933-46ea-9601-7008047ea079","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"cf67ccb1-5e40-4145-97aa-442bbc9bac69","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"65675c23-a8a3-4ff9-a519-d2e48698006f","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}},{"concept":{"name":"Child has fever","datatype":"Coded","uuid":"d5bb90bd-f597-4978-8657-15af7c04621b","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"a63e277d-af14-4b0d-8fe1-772b3549a7a4","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"ca4813dd-17c9-4e4c-9c1c-8316ad4e02d3","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}}]);
  entity.voided = false;
  return entity;
  }
  
  
  const createEncounterType = ()=>{
  const encounterType = new EncounterType();
  encounterType.uuid = "0126df9e-0167-4d44-9a2a-ae41cfc58d3d";
  encounterType.name  = "Nutritional status and Morbidity";
  encounterType.operationalEncounterTypeName = "Nutritional status and Morbidity";
  encounterType.displayName = "Nutritional status and Morbidity";
  return encounterType;
  }