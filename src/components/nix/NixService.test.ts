import "reflect-metadata";

import { Container } from "inversify";
import { INixService } from "../../interfaces.js";
import { bindings } from "../../bindings.js";

describe("NixService", () => {
  let container: Container;
  let sut: INixService;

  beforeAll(() => {
    container = new Container;
    container.loadAsync(bindings);
    sut = container.get(INixService);

    container.snapshot();
  })

  afterEach(() => {
    container.restore();
  })

  test("is defined", () => {
    expect(sut).toBeDefined();
  })
})
