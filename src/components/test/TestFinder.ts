import { inject, injectable } from "inversify";
import { readdir, stat } from "node:fs/promises";
import { resolve } from 'node:path';
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

    private async getFiles(args: CliArgs, path: Path): Promise<Path[]> {
        let files: Path[] = [];

        try {
            const stats = await stat(path);

            if (stats.isFile()) files = [path];

            if (stats.isDirectory()) {
                const read = await readdir(path).then((fs) => fs.map((f) => `${path}/${f}`));

                files = read.filter((f) => stat(f).then((f) => f.isFile()));
                const dirs = read.filter((f) => stat(f).then((f) => f.isDirectory()));

                if (args.recurse && dirs.length > 0) {
                    const newFiles = await Promise.all(dirs.map((d) => this.getFiles(args, d)));
                    files = files.concat(newFiles.flat());
                }
            }
        } catch (e: any) {
            if (e.code === "ENOENT") {
                console.log(`File does not exist: ${path}`);
            }
            else {
                console.log(`IO error: ${e.code}`);
            }
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

            const files = await this.getFiles(args, absolutePath).then((fs) =>
                fs.filter((p: Path) =>
                    p.endsWith(".test.nix")
                    || p.endsWith(".spec.nix")
                    || p.endsWith(".nixt")));

            for (const file of files) {
                if (args.debug) console.log(`Found file: ${file}`);
                const testFile = new TestFile(file);

                try {
                    const { suites } = getTestSpec(file);
                    for (const [suiteName, cases] of Object.entries(suites)) {
                        const testSuite = new TestSuite(suiteName);
                        testFile.suites.push(testSuite);
                        for (const caseName of cases) {
                            const testCase = new TestCase(caseName);
                            testSuite.cases.push(testCase);
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
