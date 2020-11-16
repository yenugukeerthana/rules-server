import {checkListRule, decisionRule, visitScheduleRule} from "./RuleEvalService";

describe('decisionRule', () => {
  it('should not be able to access node.js apis', () => {
     expect(() => decisionRule({decisionCode: '() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}'}, 'dummy'))
      .toThrow()
  });
});

describe('visitScheduleRule', () => {
  it('should not be able to access node.js apis', () => {
    expect(() => visitScheduleRule({visitScheduleCode: '() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}'}, 'dummy'))
        .toThrow()
  });
});


describe('checkListRule', () => {
  it('should not be able to access node.js apis', () => {
    expect(() => checkListRule({checklistCode: '() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}'}, 'dummy'))
        .toThrow()
  });
});

