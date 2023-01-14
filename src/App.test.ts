import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "./bindings.js";
import { IApp, IRenderService, ITestFinder, ITestRunner } from "./interfaces.js";
import { CliArgs } from "./types.js";
import { buildProviderModule } from "inversify-binding-decorators";

describe("App", () => {
    let container: Container;
    let sut: IApp;
    let args: CliArgs;

    const testFinder: ITestFinder = {
        run: async () => { return []; }
    }

    const testRunner: ITestRunner = {
        run: async () => { return []; }
    }

    const renderService: IRenderService = {
        run: () => {}
    }

    beforeAll(() => {
        container = new Container();
        container.loadAsync(bindings);
        container.load(buildProviderModule());
        container.rebind(ITestFinder).toConstantValue(testFinder);
        container.rebind(ITestRunner).toConstantValue(testRunner);
        container.rebind(IRenderService).toConstantValue(renderService);

        sut = container.get(IApp);
    });

    beforeEach(() => {
        args = {
            standalone: false,
            paths: [],
            watch: false,
            verbose: [false, false],
            list: false,
            recurse: false,
            debug: false,
            help: false,
        };
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

        const spy = vi.spyOn(sut, "running").mockImplementation(() => {});
        let expected = args;
        expected.standalone = true;

        sut.run(args);

        expect(spy).toHaveBeenCalledWith(expected, []);
    });

    it("attempts to run in flake mode when no path is given", () => {
        const spy = vi.spyOn(sut, "testing").mockImplementation(() => {});
        let expected = args;

        sut.run(args);

        expect(spy).toHaveBeenCalledWith(expected, []);
    });

    it.todo("runs in standalone mode when the nixt registry is inaccessible")
    // it("runs in standalone mode when the nixt registry is inaccessible", () => {
    //     const spy = vi.spyOn(sut, "testing").mockImplementation(() => {});
    //     let expected = args;
    //     expected.standalone = true;
    //
    //     sut.run(args);
    //
    //     expect(spy).toHaveBeenCalledWith(expected, []);
    // });

    it.todo("runs in standalone mode when the nixt registry is malformed")
    // it("runs in standalone mode when the nixt registry is malformed", () => {
    //     const spy = vi.spyOn(sut, "testing").mockImplementation(() => {});
    //     let expected = args;
    //     expected.standalone = true;
    //
    //     sut.run(args);
    //
    //     expect(spy).toHaveBeenCalledWith(expected, []);
    // });

    it.todo("runs in standalone mode when the nixt registry uses an unsupported schema")
    // it("runs in standalone mode when the nixt registry uses an unsupported schema", () => {
    //     const spy = vi.spyOn(sut, "testing").mockImplementation(() => {});
    //     let expected = args;
    //     expected.standalone = true;
    //
    //     sut.run(args);
    //
    //     expect(spy).toHaveBeenCalledWith(expected, []);
    // });

    it.todo("runs a test finder when in standalone mode");
    // it("runs a test finder when in standalone mode", () => {
    //     args.standalone = true;
    //
    //     sut.run(args);
    //
    //     expect(testFinder).toHaveBeenCalledOnce();
    // });

    it("calls test() once when watch is false", () => {
        const spy = vi.spyOn(sut, "testing").mockImplementation(() => {});

        sut.run(args);

        expect(spy).toHaveBeenCalledOnce();
    })

    it("calls test() for an initial run when watch is true", () => {
        const spy = vi.spyOn(sut, "testing").mockImplementation(() => {});
        args.watch = true;

        sut.run(args);

        expect(spy).toHaveBeenCalledTimes(1);
    })
});
