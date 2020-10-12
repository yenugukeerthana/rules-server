import {checkListRule, decisionRule, visitScheduleRule} from "./decisionRule";

describe('decisionRule', () => {
  it('should not be able to access node.js apis', () => {
     expect(() => decisionRule('() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}', 'dummy'))
      .toThrow()
  });
});

describe('visitScheduleRule', () => {
  it('should not be able to access node.js apis', () => {
    expect(() => visitScheduleRule('() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}', 'dummy'))
        .toThrow()
  });
});


describe('checkListRule', () => {
  it('should not be able to access node.js apis', () => {
    expect(() => checkListRule('() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}', 'dummy'))
        .toThrow()
  });
});

