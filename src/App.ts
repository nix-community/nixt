import chokidar from "chokidar";

import { inject, injectable } from "inversify";
import { IApp, IRenderService, ITestFinder, ITestRunner } from "./interfaces.js";
import { CliArgs, TestFile } from "./types.js";

@injectable()
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
        if (args.watch) {
            this.watch(args);
        } else {
            this.test(args);
        }
        return;
    }

    public watch(args: CliArgs) {
        console.clear();
        this.test(args);
        chokidar
            .watch(args.paths, { ignoreInitial: true })
            .on("all", () => {
                console.clear();
                this.test(args);
            });
    }

    public async test(args: CliArgs) {
        let testFiles: TestFile[] = [];

        testFiles = await this._testFinder.run(args);

        if (!args.list) {
            testFiles = await this._testRunner.run(args, testFiles);
        }

        this._renderService.run(args, testFiles);
    }
}
