import fs from 'fs';

import { inject, injectable } from "inversify";
import { resolve } from 'path';
import { INixService, ITestFinder } from "../interfaces";

import { CliArgs, Path, TestCase, TestFile, TestSpec, TestSuite } from "../types";

@injectable()
export class TestFinder implements ITestFinder {
    private _nixService: INixService;

    public constructor(
        @inject(INixService) nixService: INixService
    ) {
        this._nixService = nixService;
    }

    private getFiles(args: CliArgs, path: Path): Path[] {
        if (!fs.existsSync(path)) {
            throw new Error(`Path ${path} does not exist!`);
        }

        const stats = fs.statSync(path);

        if (stats.isFile()) {
            if (args.debug) console.log(`Found: ${path}`);
            return [path];
        }

        if (stats.isDirectory()) {
            const read = fs.readdirSync(path).map(file => `${path}/${file}`);

            let files = read.filter(file => fs.statSync(file).isFile());
            const dirs = read.filter(file => fs.statSync(file).isDirectory());

            if (!args.noRecurse && dirs.length > 0) {
                const newFiles = dirs.map(dir => this.getFiles(args, dir)).flat();
                files = files.concat(newFiles);
            }

            return files;
        }

        return []
    }

    public async run(args: CliArgs, abPath: Path): Promise<TestFile[]> {
        const getTestSpec = (f: Path): TestSpec => {
            return this._nixService.eval("get-testspec.nix", { args: { path: resolve(f), } });
        }

        const files = this.getFiles(args, abPath)
            .filter(p =>
                p.endsWith(".test.nix")
                || p.endsWith(".spec.nix")
                || p.endsWith(".nixt"));

        const testFiles: TestFile[] = [];

        for (const file of files) {
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
                testFile.importError = e.message;
            }
            testFiles.push(testFile);
        }

        return testFiles;
    }
}
