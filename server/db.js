var promise = require('bluebird');
// var rulesConfig = require("rules-config");
// var lodash =require("lodash");
// var moment= require("moment");
import lodash from 'lodash';
import moment from 'moment';
import * as rulesConfig from 'rules-config';

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/openchs';
// var connectionString = 'postgres://localhost:5432/tmc';
var db = pgp(connectionString);


function generateRules(req, res, next) {
  // db.any("select decision_rule as rules from form where uuid = '38a778be-991f-40f0-9837-7244836ecdfc'")
  //   .then(function (data) {
  //     console.log(data.rules);
  //     // res.status(200)
  //     //   .json({
  //     //     status: 'success',
  //     //     data: data,
  //     //     message: 'Retrieved ALL forms'
  //     //   });
  //   })
  //   .catch(function (err) {
  //     return next(err);
  //   });
    const defaultDecisions = {
      "enrolmentDecisions": [],
      "encounterDecisions": [],
      "registrationDecisions": []
  };
 const entity = '{"uuid":"387f74a3-829f-4b6e-8995-ab5b0e211669","name":null,"encounterType":{"uuid":"0126df9e-0167-4d44-9a2a-ae41cfc58d3d","name":"Nutritional status and Morbidity","operationalEncounterTypeName":"Nutritional status and Morbidity","displayName":"Nutritional status and Morbidity"},"earliestVisitDateTime":null,"maxVisitDateTime":null,"encounterDateTime":"2020-02-11T05:00:00.000Z","programEnrolmentUUID":"ac895795-54e0-418b-b96d-410ca6cc639e","observations":[{"concept":{"name":"Whether having cough and cold","datatype":"Coded","uuid":"e6bd3ca9-caed-462a-bf7a-1614269ebeaa","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"48a55b75-2ff9-440a-84fb-795d29f97a75","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"b1b5da7b-50b6-4c02-b933-03bd2975145a","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}},{"concept":{"name":"Baby has got diarrohea","datatype":"Coded","uuid":"d7ae84be-0642-4e46-9d91-699574082abb","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"b0ef4333-5d9a-4f4a-83e6-81b1503b4039","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"6e1bad13-a896-4783-8f27-97e2e6780c58","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}},{"concept":{"name":"Is current weight of the child equal to or less than the previous months weight?","datatype":"Coded","uuid":"158d59f3-5933-46ea-9601-7008047ea079","unit":null,"lowAbsolute":null,"lowNormal":null,"hiNormal":null,"hiAbsolute":null,"answers":{"0":{"uuid":"cf67ccb1-5e40-4145-97aa-442bbc9bac69","concept":{"uuid":"04bb1773-c353-44a1-a68c-9b448e07ff70","name":"Yes","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":1,"abnormal":false,"unique":false,"voided":false},"1":{"uuid":"65675c23-a8a3-4ff9-a519-d2e48698006f","concept":{"uuid":"e7b50c78-3d90-484d-a224-9887887780dc","name":"No","datatype":"NA","answers":{},"lowAbsolute":null,"hiAbsolute":null,"lowNormal":null,"hiNormal":null,"unit":null,"keyValues":{},"voided":false},"answerOrder":2,"abnormal":false,"unique":false,"voided":false}}},"valueJSON":{"answer":"e7b50c78-3d90-484d-a224-9887887780dc"}}]}';
  const text = "\"use strict\";\n({params, imports}) => {\n    const programEncounter = params.entity;\n    const decisions = params.decisions;\n    const complicationsBuilder = new imports.rulesConfig.complicationsBuilder({\n        programEncounter: programEncounter,\n        complicationsConcept: \"Refer to the hospital immediately for\"\n    });\n\n    complicationsBuilder.addComplication(\"Baby has got diarrohea\")\n        .when.valueInEncounter(\"Baby has got diarrohea\").is.no;\n\n    const complications = complicationsBuilder.getComplications();\n\n    decisions.encounterDecisions.push(complications);\n    return decisions;\n};";
  // const individualUUID = getIndividualUUID(entity, "ProgramEncounter");

  const ruleFunc = eval(text);
  const ruleDecisions = ruleFunc({
      params: { decisions: defaultDecisions, entity },
      imports: { rulesConfig, lodash, moment }
  });

  const decisionsMap = validateDecisions(ruleDecisions, "38a778be-991f-40f0-9837-7244836ecdfc", "35253eab-6594-4bad-9243-ca6ef15fc054");
  const trimmedDecisions = trimDecisionsMap(decisionsMap);
  General.logDebug("RuleEvaluationService", trimmedDecisions);
  console.log(trimmedDecisions);
  return trimmedDecisions;

}

function validateDecisions(decisionsMap, ruleUUID, individualUUID) {
  return _.merge(..._.map(decisionsMap, (decisions, decisionType) => {
      return {
          [decisionType]: decisions
              .filter(decision => this.checkConceptForRule(decision.name, ruleUUID, individualUUID))
              .map(decision => this.filterValues(decision, ruleUUID, individualUUID))
      }
  }));
}

const trimDecisionsMap = (decisionsMap) => {
  const trimmedDecisions = {};
  _.forEach(decisionsMap, (decisions, decisionType) => {
      trimmedDecisions[decisionType] = _.reject(decisions, _.isEmpty);
  });
  return trimmedDecisions;
};

function getIndividualUUID(entity, entityName){
  switch (entityName) {
      case 'Individual':
          return entity.uuid;
      case 'ProgramEnrolment':
          return entity.individual.uuid;
      case 'ProgramEncounter':
          return entity.programEnrolment.individual.uuid;
      case 'Encounter':
          return entity.individual.uuid;
      case 'WorkList':
          return entity.getCurrentWorkItem().parameters.subjectUUID;
      default:
          return "entity not mapped";
  }
};

module.exports = {
  getAllPlayers: getAllPlayers,
  getSinglePlayer: getSinglePlayer,
  createPlayer: createPlayer,
  updatePlayer: updatePlayer,
  deletePlayer: deletePlayer,
  generateRules: generateRules
};