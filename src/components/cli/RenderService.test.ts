import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { IRenderService } from "../../interfaces.js";

describe("RenderService", () => {
  let container: Container;
  let sut: IRenderService;

  beforeAll(() => {
    container = new Container;
    container.load(bindings);
    sut = container.getTagged(IRenderService, "ink", false);
  })

  beforeEach(() => {
    container.snapshot();
  })

  it("is defined", () => {
    expect(sut).toBeDefined();
  })
})
