import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { INixService, TestService } from "../../interfaces.js";
import { CliArgs, TestFile } from "../../types.js";

@provide(TestService)
export class TestFinder implements TestService {
  private _nixService: INixService;

  public constructor(
    @inject(INixService) nixService: INixService
  ) {
    this._nixService = nixService;
  }

  private async run(args: CliArgs): Promise<TestFile[]> {
    let spec: TestFile[] = [];



    return spec
  }
  // private async getFiles(args: CliArgs, path: string): Promise<string[]> {
  //     let files: string[] = [];

  //     try {
  //         const stats = await stat(path);

  //         if (stats.isFile()) files = [path];

  //         if (stats.isDirectory()) {
  //             const read = await readdir(path).then((fs) => fs.map((f) => `${path}/${f}`));

  //             files = read.filter((f) => stat(f).then((f) => f.isFile()));
  //             const dirs = read.filter((f) => stat(f).then((f) => f.isDirectory()));

  //             if (args.recurse && dirs.length > 0) {
  //                 const newFiles = await Promise.all(dirs.map((d) => this.getFiles(args, d)));
  //                 files = files.concat(newFiles.flat());
  //             }
  //         }
  //     } catch (e: any) {
  //         if (e.code === "ENOENT") {
  //             console.log(`File does not exist: ${path}`);
  //         }
  //         else {
  //             console.log(`IO error: ${e.code}`);
  //         }
  //     }

  //     return files;
  // }

  // public async run(args: CliArgs): Promise<TestFile[]> {
  //     const testFiles: TestFile[] = [];

  //     const getTestSpec = (file: string): TestSpec => {
  //         let traceArg = false;
  //         if (args.verbose[1]) traceArg = true;

  //         const spec = this._nixService.run("get-testspec.nix", {
  //             trace: traceArg,
  //             debug: args.debug,
  //             args: {
  //                 path: resolve(file)
  //             }
  //         });

  //         return spec;
  //     }

  //     for (const p of args.paths) {
  //         const absolutestring = resolve(p);

  //         const files = await this.getFiles(args, absolutestring).then((fs) =>
  //             fs.filter((p: string) =>
  //                 p.endsWith(".test.nix")
  //                 || p.endsWith(".spec.nix")
  //                 || p.endsWith(".nixt")));

  //         for (const file of files) {
  //             if (args.debug) console.log(`Found file: ${file}`);
  //             const testFile = new TestFile(file);

  //             try {
  //                 const { suites } = getTestSpec(file);
  //                 for (const [suiteName, cases] of Object.entries(suites)) {
  //                     const testSuite = new TestSuite(suiteName);
  //                     testFile.suites.push(testSuite);
  //                     for (const caseName of cases) {
  //                         const testCase = new TestCase(caseName);
  //                         testSuite.cases.push(testCase);
  //                     }
  //                 }
  //             } catch (e: any) {
  //                 if (args.debug) console.log(`Import error!\n  ${e.message}`);
  //                 testFile.importError = e.message;
  //             }
  //             testFiles.push(testFile);
  //         }
  //     }

  //     return testFiles;
  // }
}
