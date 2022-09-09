import { resolve } from "path";

import { inject, injectable } from "inversify";
import { INixService, ITestRunner } from "../interfaces";

import { CliArgs, NixOptions, Path, TestCase, TestFile, TestSuite } from "../types";

@injectable()
export class TestRunner implements ITestRunner {
    private _nixService: INixService;

    public constructor(
        @inject(INixService) nixService: INixService
    ) {
        this._nixService = nixService;
    }

    public async run(args: CliArgs, files: TestFile[]): Promise<void> {
        const getTestCase = (f: Path, s: TestSuite["name"], c: TestCase["name"], t: NixOptions["trace"]) => {
            return this._nixService.eval("get-testcase.nix", {
                trace: t,
                args: {
                    path: resolve(f),
                    suite: s,
                    case: c
                }
            })
        }

        for (const f of files) {
            for (const [suiteName, testSuite] of Object.entries(f.suites)) {
                for (const [caseName, testCase] of Object.entries(testSuite.cases)) {
                    try {
                        testCase.result = getTestCase(f.path, suiteName, caseName, args.verbose[1])
                    } catch (e: any) {
                        testCase.error = e.message;
                    }
                }
            }
        }
        return
    }
}
