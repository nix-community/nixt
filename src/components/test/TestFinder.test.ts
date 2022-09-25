import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { ITestFinder } from "../../interfaces.js";

describe("ItFinder", () => {
  let container: Container;
  let sut: ITestFinder;

  beforeAll(() => {
    container = new Container;
    container.loadAsync(bindings);
    sut = container.get(ITestFinder);
  })

  beforeEach(() => {
    container.snapshot();
  })

  it("is defined", () => {
    expect(sut).toBeDefined();
  })

  it.todo("returns correct structure");
  it.todo("sets importError values");
})
