import { inject, injectable } from "inversify";
import { ITestRenderer, ITestRunner, ITestService } from "../interfaces";

import { CliArgs } from "../types";

@injectable()
export class TestService implements ITestService {
    private _testRunner: ITestRunner;
    private _testRenderer: ITestRenderer;

    constructor(
        @inject(ITestRunner) testRunner: ITestRunner,
        @inject(ITestRenderer) testRenderer: ITestRenderer
    ) {
        this._testRunner = testRunner;
        this._testRenderer = testRenderer;
    }

    run(listArg: CliArgs["list"], verboseArg: CliArgs["verbose"]): void {
        if (listArg) {
            if (verboseArg[0]) console.log("LIST");
            this._testRenderer.list([]);
        } else {
            if (verboseArg[0]) console.log("RESULT");
            this._testRunner.run([]);
            this._testRenderer.result([]);
        }
        return
    }
}
