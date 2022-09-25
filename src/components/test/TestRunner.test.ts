import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { ITestRunner } from "../../interfaces.js";

describe("TestRunner", () => {
  let container: Container;
  let sut: ITestRunner;

  beforeAll(() => {
    container = new Container;
    container.loadAsync(bindings);
    sut = container.get(ITestRunner);
  })

  beforeEach(() => {
    container.snapshot();
  })

  it("is defined", () => {
    expect(sut).toBeDefined();
  })

  it.todo("handles failed tests");
})
