import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { ITestFinder, ITestRunner } from "../../interfaces.js";
import { CliArgs, TestFile } from "../../types.js";
import path from "node:path";

describe("TestRunner", () => {
    let container: Container;
    let args: CliArgs;
    let testFinder: ITestFinder;
    let sut: ITestRunner;

    beforeAll(() => {
        container = new Container;
        container.loadAsync(bindings);
        testFinder = container.get(ITestFinder);
        sut = container.get(ITestRunner);
    })

    beforeEach(() => {
        container.snapshot();
        args = {
            standalone: false,
            paths: [],
            watch: false,
            verbose: [false, false],
            list: false,
            recurse: false,
            debug: false,
            help: false
        };
    })

    afterEach(() => {
        container.restore();
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    })

    it("handles failed tests", async () => {
        args.paths = ["__mocks__/fail.spec.nix"];

        const result: TestFile[] = await sut.run(args, await testFinder.run(args))
        expect(result[0]).toBeDefined();
        expect(result[0]?.path).toStrictEqual(path.resolve("__mocks__/fail.spec.nix"));
        expect(result[0]?.importError).toBeUndefined();
        expect(result[0]?.suites[0]?.cases[0]?.result).toEqual(false);
    })

    it("handles undefined tests", async () => {
        args.paths = ["__mocks__/undefined.spec.nix"]

        const result: TestFile[] = await sut.run(args, await testFinder.run(args))
        expect(result[0]).toBeDefined();
        expect(result[0]?.path).toStrictEqual(path.resolve("__mocks__/undefined.spec.nix"));
        expect(result[0]?.importError).toBeUndefined();
        expect(result[0]?.suites[0]?.cases[0]?.error).toBeDefined();
    })
})
