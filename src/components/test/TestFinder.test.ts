import "reflect-metadata";

import { Container } from "inversify";
import path from "node:path";
import { bindings } from "../../bindings.js";
import { ITestFinder } from "../../interfaces.js";
import { CliArgs } from "../../types.js";

const defaultArgs = {
    standalone: true,
    paths: ["."],
    watch: false,
    verbose: [false, false],
    list: false,
    recurse: false,
    debug: false,
    help: false
};

describe("ItFinder", () => {
    let container: Container;
    let args: CliArgs;
    let sut: ITestFinder;

    beforeAll(() => {
        container = new Container;
        container.load(bindings);
        sut = container.get(ITestFinder);
    })

    beforeEach(() => {
        container.snapshot();
        args = defaultArgs;
    })

    afterEach(() => {
        container.restore();
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    })

    it("handles import failures", async () => {
        args.paths = ["__mocks__/invalid.test.nix"];

        const result = await sut.run(args)

        expect(result[0]).toBeDefined();
        expect(result[0]?.path).toStrictEqual(path.resolve("__mocks__/invalid.test.nix"));
        expect(result[0]?.suites).toStrictEqual([]);
        expect(result[0]?.importError).toBeDefined();
    })
})
