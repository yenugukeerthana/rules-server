import {checkListRule, decisionRule, visitScheduleRule} from "./decisionRule";

describe('decisionRule', () => {
  it('should not be able to access node.js apis', async () => {
    await expect(decisionRule('() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}', 'dummy'))
      .rejects.toThrow()
  });
});

describe('visitScheduleRule', () => {
  it('should not be able to access node.js apis', async () => {
    await expect(visitScheduleRule('() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}', 'dummy'))
      .rejects.toThrow()
  });
});


describe('checkListRule', () => {
  it('should not be able to access node.js apis', async () => {
    await expect(checkListRule('() => { var fs = require("fs"); fs.readdirSync("/", "utf8")}', 'dummy'))
      .rejects.toThrow()
  });
});

