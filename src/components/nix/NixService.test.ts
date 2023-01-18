import "reflect-metadata";

import { Container } from "inversify";
import { resolve } from "node:path";
import { bindings } from "../../bindings.js";
import { INixService } from "../../interfaces.js";

describe("NixService", () => {
    let container: Container;
    let sut: INixService;

    beforeAll(() => {
        container = new Container;
        container.load(bindings);
        sut = container.get(INixService);
    })

    beforeEach(() => {
        container.snapshot();
    })

    afterEach(() => {
        container.restore();
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    })

    it("returns nix results", () => {
        const path = resolve("examples/valid.nixt");
        const expected = {
            "path": path,
            "suites": {
                "Valid Tests": ["always passes"]
            }
        }

        const result = sut.run("get-testspec.nix", {
            trace: false,
            debug: false,
            args: { path: path }
        })

        expect(result).toStrictEqual(expected)
    })

    it("throws error on invalid path", () => {
        function testSut() {
            sut.run("somePathWhichDoesNotExist", {
                trace: false,
                debug: false,
                args: { path: resolve("__mocks__/valid.nixt") }
            })
        }
        expect(testSut).toThrow(Error);
    })
})
