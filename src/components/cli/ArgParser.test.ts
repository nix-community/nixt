import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { IArgParser } from "../../interfaces.js";

describe("ArgParser", () => {
  let container: Container;
  let sut: IArgParser;

  beforeAll(() => {
    container = new Container;
    container.load(bindings);
    sut = container.get(IArgParser);
  })

  beforeEach(() => {
    container.snapshot();
  })

  it("is defined", () => {
    expect(sut).toBeDefined();
  })

  it.todo("returns sensible defaults");
  it.todo("returns correct structure");
})
