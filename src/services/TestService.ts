import { inject, injectable } from "inversify";
import { ITestFinder, ITestRenderer, ITestRunner, ITestService } from "../interfaces";

import { CliArgs } from "../types";

@injectable()
export class TestService implements ITestService {
    private _testFinder: ITestFinder;
    private _testRunner: ITestRunner;
    private _testRenderer: ITestRenderer;

    constructor(
        @inject(ITestFinder) testFinder: ITestFinder,
        @inject(ITestRunner) testRunner: ITestRunner,
        @inject(ITestRenderer) testRenderer: ITestRenderer
    ) {
        this._testFinder = testFinder;
        this._testRunner = testRunner;
        this._testRenderer = testRenderer;
    }

    run(args: CliArgs): void {
        const testFiles = this._testFinder.run(args);

        if (args.list) {
            if (args.debug) console.log("List arg is true, list tests");
            this._testRenderer.list(args, testFiles);
        } else {
            if (args.debug) console.log("List arg is false, run tests");
            this._testRunner.run(args, testFiles);
            this._testRenderer.result(args, testFiles);
        }
        return
    }
}
