import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { INixService } from "../../interfaces.js";
import { execSync } from "node:child_process";

vi.mock("node:child_process", () => ({
    execSync: vi.fn()
}));

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
        vi.restoreAllMocks();
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    })

    it("returns an object", () => {
        const expected = `{
            "__schema": "v0.0",
            "settings": {
                "list": false,
                "watch": false,
                "verbose": false,
                "trace": false
            },
            "testSpec": [{
                "path": "./dummy.nix",
                "suites": [{
                    "name": "Dummy",
                    "cases": [{
                        "name": "is a dummy suite",
                        "expressions": [true]
                    }]
                }]
            }]
        }`

        execSync.mockImplementationOnce((command: string) => {
            if (command.includes(".#__nixt") === true) return expected
            return {};
        })

        const result = sut.run(".#__nixt", false)

        expect(result).toStrictEqual(JSON.parse(expected))
    })

    it("throws on invalid target", () => {
        const dummyError = "error: Dummy error";
        execSync.mockReturnValueOnce(dummyError);

        expect(sut.run).toThrowError(dummyError);
    })
})
