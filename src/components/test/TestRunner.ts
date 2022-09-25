import { inject, injectable } from "inversify";
import { resolve } from "node:path";
import { INixService, ITestRunner } from "../../interfaces.js";
import { CliArgs, NixOptions, Path, TestCase, TestFile, TestSuite } from "../../types.js";

@injectable()
export class TestRunner implements ITestRunner {
  private _nixService: INixService;

  public constructor(
    @inject(INixService) nixService: INixService
  ) {
    this._nixService = nixService;
  }

  private getTestCase(
    f: Path,
    s: TestSuite["name"],
    c: TestCase["name"],
    t: NixOptions["trace"]
  ) {
    return this._nixService.eval("get-testcase.nix", {
      trace: t,
      args: {
        path: resolve(f),
        suite: s,
        case: c
      }
    })
  }

  // TODO return TestFile[] to improve testability
  public async run(args: CliArgs, files: TestFile[]): Promise<void> {
    let traceArg = false;
    if (args.verbose[1]) traceArg = true;

    for (const f of files) {
      for (const [sName, s] of Object.entries(f.suites)) {
        if (args.debug) console.log(sName)
        for (const [cName, c] of Object.entries(s.cases)) {
          if (args.debug) console.log(cName);
          try {
            c.result = this.getTestCase(f.path, sName, cName, traceArg);
          } catch (e: any) {
            c.error = e.message;
          }
        }
      }
    }

    return
  }
}
