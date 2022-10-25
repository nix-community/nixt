import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { ITestFinder, ITestRunner } from "../../interfaces.js";
import { CliArgs, TestCase, TestSuite } from "../../types.js";
import path from "node:path";

const defaultArgs = {
    paths: ["."],
    watch: false,
    verbose: [false, false],
    list: false,
    recurse: false,
    debug: false,
    help: false
};

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
        args = defaultArgs;
    })

    afterEach(() => {
        container.restore();
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    })

    it("handles failed tests", async () => {
        args.paths = ["__mocks__/fail.spec.nix"];

        const result = await sut.run(args, await testFinder.run(args))
        expect(result).toEqual([{
            "path": path.resolve("__mocks__/fail.spec.nix"),
            "suites": {
                "Failing Test": {
                    "name": "Failing Test",
                    "cases": {
                        "always fails": {
                            "name": "always fails",
                            "result": false,
                        },
                    },
                },
            },
        },]);
    })

    it("handles undefined tests", async () => {
        args.paths = ["__mocks__/undefined.spec.nix"]

        const nixPath = path.resolve("nix/get-testcase.nix")
        const testPath = path.resolve("__mocks__/undefined.spec.nix");

        const result = await sut.run(args, await testFinder.run(args))
        expect(result).toEqual([{
            "path": testPath,
            "suites": {
                "Undefined Test": {
                    "name": "Undefined Test",
                    "cases": {
                        "always undefined": {
                            "name": "always undefined",
                            "error": `Command failed: nix eval --json --impure  --expr 'import ${nixPath} { path = \"${testPath}\"; suite = \"Undefined Test\"; case = \"always undefined\"; }'\nerror: undefined variable 'baz'\n\n       at ${testPath}:10:26:\n\n            9|   \"Undefined Test\" = {\n           10|     \"always undefined\" = baz;\n             |                          ^\n           11|   };\n(use '--show-trace' to show detailed location information)\n`,
                        },
                    },
                },
            },
        }])
    })
})
