import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { resolve } from "node:path";
import { INixService, ITestRunner } from "../../interfaces.js";
import { CliArgs, NixOptions, TestCase, TestFile, TestSuite } from "../../types.js";

@provide(ITestRunner)
export class TestRunner implements ITestRunner {
    private _nixService: INixService;

    public constructor(
        @inject(INixService) nixService: INixService
    ) {
        this._nixService = nixService;
    }

    private getTestCase(
        file: string,
        testSuite: TestSuite["name"],
        testCase: TestCase["name"],
        trace: NixOptions["trace"]
    ) {
        return this._nixService.run("get-testcase.nix", {
            trace: trace,
            args: {
                path: resolve(file),
                suite: testSuite,
                case: testCase,
            }
        })
    }

    public async run(args: CliArgs, files: TestFile[]): Promise<TestFile[]> {
        let newFiles: TestFile[] = files;

        let traceArg = false;
        if (args.verbose[1]) traceArg = true;

        for (const f of newFiles) {
            for (const s of f.suites) {
                if (args.debug) console.log(s.name)
                for (const c of s.cases) {
                    if (args.debug) console.log(c.name);
                    try {
                        c.result = this.getTestCase(f.path, s.name, c.name, traceArg);
                    } catch (e: any) {
                        c.error = e.message;
                    }
                }
            }
        }

        return newFiles
    }
}
