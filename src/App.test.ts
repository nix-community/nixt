import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "./bindings.js";
import { IApp, INixService, IRenderService, ITestFinder } from "./interfaces.js";
import { CliArgs, Schema, TestFile } from "./types.js";

const nixService = {
    run: vi.fn(() => { return {} })
}

const renderService = {
    run: vi.fn()
}

const testFinder = {
    run: vi.fn(async (): Promise<TestFile[]> => { return [] })
}

describe("App", () => {
    let container: Container;
    let sut: IApp;
    let args: CliArgs;
    let registry: Schema;

    beforeAll(() => {
        container = new Container();
        container.load(bindings);
        container.rebind(INixService).toConstantValue(nixService);
        container.rebind(IRenderService).toConstantValue(renderService);
        container.rebind(ITestFinder).toConstantValue(testFinder);

        sut = container.get(IApp);
    });

    beforeEach(() => {
        args = {
            paths: [],
            watch: false,
            verbose: [false, false],
            list: false,
            recurse: false,
            debug: false,
            help: false,
        };

        registry = {
            __schema: "v0.0",
            settings: {
                list: false,
                watch: false,
                verbose: false,
                trace: false
            },
            testSpec: [{
                path: "./dummy.nix",
                suites: [{
                    name: "Dummy",
                    cases: [{
                        name: "is a dummy suite",
                        expressions: [true]
                    }]
                }]
            }]
        }

        container.snapshot();
    });

    afterEach(() => {
        container.restore();
        vi.restoreAllMocks();
    });

    it("is defined", () => {
        expect(sut).toBeDefined();
    });

    it("runs in standalone mode when a path is given", () => {
        args.paths = ["."];

        sut.run(args);

        expect(testFinder.run).toHaveBeenCalledOnce();
    });

    it("runs in flake mode when no path is given", () => {
        nixService.run.mockReturnValueOnce(registry);
        const spy = vi.spyOn(sut, "reporting").mockImplementation(() => {});

        sut.run(args);

        expect(testFinder.run).toHaveBeenCalledTimes(0);
        expect(spy).toHaveBeenCalledWith(args, registry.testSpec);
    });

    it("runs in standalone mode when the nixt registry is inaccessible", () => {
        const spy = vi.spyOn(sut, "reporting").mockImplementation(() => {});

        sut.run(args);

        expect(testFinder.run).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(args, []);
    });

    it("runs in standalone mode when the nixt registry is malformed", () => {
        nixService.run.mockReturnValueOnce({ testSpec: "This isn't an array." });
        const spy = vi.spyOn(sut, "reporting").mockImplementation(() => {});

        sut.run(args);

        expect(testFinder.run).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(args, []);
    });

    it("runs in standalone mode when the nixt registry uses an unsupported schema", () => {
        registry.__schema = "v9001"
        nixService.run.mockReturnValueOnce(registry);
        const spy = vi.spyOn(sut, "reporting").mockImplementation(() => {});

        sut.run(args);

        expect(testFinder.run).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(args, []);
    });

    it("calls renderService once when watch is false", () => {
        args.watch = false;

        sut.run(args);

        expect(renderService.run).toHaveBeenCalledOnce();
    })

    it("calls renderService for an initial run when watch is true", async () => {
        args.watch = true;

        sut.run(args);

        expect(renderService.run).toHaveBeenCalled();
    })
});
