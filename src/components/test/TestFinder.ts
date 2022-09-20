import fs from 'fs';
import { resolve } from 'path';

import { inject, injectable } from "inversify";
import { INixService, ITestFinder } from "../../interfaces.js";
import { CliArgs, Path, TestCase, TestFile, TestSpec, TestSuite } from "../../types.js";

@injectable()
export class TestFinder implements ITestFinder {
  private _nixService: INixService;

  public constructor(
    @inject(INixService) nixService: INixService
  ) {
    this._nixService = nixService;
  }

  private getFiles(args: CliArgs, path: Path): Path[] {
    let files: Path[] = [];

    if (fs.existsSync(path)) {
      const stats = fs.statSync(path);

      if (stats.isFile()) files = [path];

      if (stats.isDirectory()) {
        const read = fs.readdirSync(path).map((file: string) => `${path}/${file}`);

        files = read.filter((file: string) => fs.statSync(file).isFile());
        const dirs = read.filter((file: string) => fs.statSync(file).isDirectory());

        if (args.recurse && dirs.length > 0) {
          const newFiles = dirs.map((dir: string) => this.getFiles(args, dir)).flat();
          files = files.concat(newFiles);
        }
      }
    } else {
      console.log(`Path ${path} does not exist!`);
    }

    return files;
  }

  public async run(args: CliArgs): Promise<TestFile[]> {
    const testFiles: TestFile[] = [];

    const getTestSpec = (f: Path): TestSpec => {
      let traceArg = false;
      if (args.verbose[1]) traceArg = true;

      const spec = this._nixService.eval("get-testspec.nix", {
        trace: traceArg,
        debug: args.debug,
        args: {
          path: resolve(f)
        }
      });

      return spec;
    }

    for (const p of args.paths) {
      const absolutePath = resolve(p);

      const files = this.getFiles(args, absolutePath)
        .filter((p: Path) =>
          p.endsWith(".test.nix")
          || p.endsWith(".spec.nix")
          || p.endsWith(".nixt"));

      for (const file of files) {
        if (args.debug) console.log(`Found file: ${file}`);
        const testFile = new TestFile(file);

        try {
          const { suites } = getTestSpec(file);
          for (const [suiteName, cases] of Object.entries(suites)) {
            const testSuite = new TestSuite(suiteName);
            testFile.suites[suiteName] = testSuite;
            for (const caseName of cases) {
              const testCase = new TestCase(caseName);
              testSuite.cases[caseName] = testCase;
            }
          }
        } catch (e: any) {
          if (args.debug) console.log(`Import error!\n  ${e.message}`);
          testFile.importError = e.message;
        }
        testFiles.push(testFile);
      }
    }

    return testFiles;
  }
}
