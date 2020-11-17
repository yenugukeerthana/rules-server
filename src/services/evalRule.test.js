import evalRule from "./evalRule";

describe('evalRule', () => {
  it('should not be able to access node.js apis', () => {
     expect(() => evalRule('var fs = require("fs"); fs.readdirSync("/", "utf8")'))
      .toThrow()
  });
});