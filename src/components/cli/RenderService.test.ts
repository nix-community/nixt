import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { IRenderService } from "../../interfaces.js";

describe("RenderService", () => {
  let container: Container;
  let sut: IRenderService;

  beforeAll(() => {
    container = new Container;
    container.loadAsync(bindings);
    sut = container.get(IRenderService);
  })

  beforeEach(() => {
    container.snapshot();
  })

  it("is defined", () => {
    expect(sut).toBeDefined();
  })
})
