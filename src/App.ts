import chokidar from "chokidar";

import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { IApp, IRenderService, ITestFinder, ITestRunner } from "./interfaces.js";
import { CliArgs, TestFile } from "./types.js";

@provide(IApp)
export class App implements IApp {
    private _testRunner: ITestRunner;
    private _renderService: IRenderService;
    private _testFinder: ITestFinder;

    public constructor(
        @inject(ITestRunner) testRunner: ITestRunner,
        @inject(IRenderService) renderService: IRenderService,
        @inject(ITestFinder) testFinder: ITestFinder
    ) {
        this._testRunner = testRunner;
        this._renderService = renderService;
        this._testFinder = testFinder;
    }

    public run(args: CliArgs) {
        this.initializing(args);
    }

    public initializing(args: CliArgs) {
        let spec: TestFile[] = [];

        // Run in standalone mode?
        if (args.paths.length > 0) {
            args.standalone = true;
            console.log("Path provided; running in standalone mode");
        }
        // else if (/*TODO: check here for failure to access __nixt*/) {
        //     args.standalone = true;
        //     args.paths = ["."];
        //     console.log("Failed to access __nixt; running in standalone mode");
        // }

        this.running(args, spec);
    }

    public async running(args: CliArgs, spec: TestFile[]) {
        let _spec: TestFile[];

        args.standalone
            ? _spec = await this._testFinder.run(args)
            : _spec = spec;

        args.watch
            ? this.watching(args, _spec)
            : this.testing(args, _spec)
    }

    public watching(args: CliArgs, spec: TestFile[]) {
        const watcher = chokidar.watch(args.paths, { ignoreInitial: true });
        if (args.list === true) {
            this.reporting(args, spec);
            watcher.on("all", () => {
                this.reporting(args, spec);
            });
        } else {
            this.testing(args, spec);
            watcher.on("all", () => {
                this.testing(args, spec);
            });
        }
    }

    public async testing(args: CliArgs, spec: TestFile[]) {
        const testedSpec = await this._testRunner.run(args, spec);

        this.reporting(args, testedSpec)
    }

    public reporting(args: CliArgs, spec: TestFile[]) {
        this._renderService.run(args, spec);
    }
}
