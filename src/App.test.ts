import "reflect-metadata";

import { Container } from "inversify";
import { IApp, IArgParser } from "./interfaces.js";
import { bindings } from "./bindings.js";

describe("App", () => {
    let container: Container;
    let sut: IApp;

    beforeAll(() => {
        const mockArgParser: IArgParser = {
            run: () => {
                const args = {
                    paths: ["."],
                    watch: false,
                    verbose: [false, false],
                    list: false,
                    recurse: false,
                    debug: false,
                    help: false,
                };

                return args;
            },
        };

        container = new Container();
        container.loadAsync(bindings);
        container.unbind(IArgParser);
        container.bind(IArgParser).toConstantValue(mockArgParser);
        sut = container.get(IApp);
    });

    beforeEach(() => {
        container.snapshot();
    });

    it("is defined", () => {
        expect(sut).toBeDefined();
    });

    it.todo("returns non-zero exit code on fail");
    it.todo("returns non-zero exit code on import err");
});
