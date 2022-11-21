import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { IRenderService } from "../../interfaces.js";
import { InkService } from "./index.js";

describe("InkRenderService", () => {
    let container: Container;
    let sut: IRenderService;

    beforeAll(() => {
        container = new Container;
        container.loadAsync(bindings);
        container.unbind(IRenderService);
        container.bind(IRenderService).to(InkService);
        sut = container.get(IRenderService);
    })

    beforeEach(() => {
        container.snapshot();
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    })

    it.todo("shows list of tests when list is true");
    it.todo("shows all tests when verbose is true")
    it.todo("shows list of failed tests");
    it.todo("shows count of passed suites and tests");
})
