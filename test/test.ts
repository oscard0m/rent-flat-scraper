import { expect } from "chai";
import "mocha";

describe("Hello function", () => {
  it("should return hello world", () => {
    expect("Hello World!").to.equal("Hello World!");
  });
});
