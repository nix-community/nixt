import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "./bindings.js";
import { IApp, IRenderService, ITestFinder, ITestRunner } from "./interfaces.js";
import { CliArgs } from "./types.js";

describe("App", () => {
    let container: Container;
    let sut: IApp;
    let args: CliArgs

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
        container.rebind(ITestFinder).toConstantValue(testFinder);
        container.rebind(ITestRunner).toConstantValue(testRunner);
        container.rebind(IRenderService).toConstantValue(renderService);
        sut = container.get(IApp);
    });

    beforeEach(() => {
        args = {
            paths: ["."],
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
    })

    it("is defined", () => {
        expect(sut).toBeDefined();
    });

    it("calls test() once when watch is false", () => {
        const spy = vi.spyOn(sut, "test").mockImplementation(() => {});

        sut.run(args);

        expect(spy).toHaveBeenCalledTimes(1);
    })

    // FIXME: Watcher persists
    it.todo("calls test() for an initial run when watch is true");
    // it("calls test() for an initial run when watch is true", () => {
    //     const spy = jest.spyOn(sut, "test").mockImplementation(() => {});
    //     args.watch = true;

    //     sut.run(args);

    //     expect(spy).toHaveBeenCalledTimes(1);
    // })

    it.todo("returns non-zero exit code on fail");
    it.todo("returns non-zero exit code on import err");
});
