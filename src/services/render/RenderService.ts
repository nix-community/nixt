import { bold, gray, green, italic, magenta, red, yellow } from 'colors';

import { injectable } from "inversify";
import { IRenderService } from "../../interfaces";

import { CliArgs, Path, TestCase, TestFile, TestSuite } from "../../types";
import * as warningFilters from './warningFilters'

@injectable()
export class RenderService implements IRenderService {
    private args: CliArgs;
    private path: Path;

    private files: TestFile[];
    private suites: TestSuite[];
    private cases: TestCase[];

    private importSuccesses: TestFile[];
    private importFailures: TestFile[];

    private getProps(): void {
        const suites = [];
        const cases = [];

        for (const f of this.files) {
            for (const s of Object.values(f.suites)) {
                suites.push(s);
                for (const c of Object.values(s.cases)) {
                    cases.push(c);
                }
            }
        }

        this.suites = suites;
        this.cases = cases;

        this.importSuccesses = this.files.filter(f => !f.importError);
        this.importFailures = this.files.filter(f => f.importError);
    }

    private list(c: TestCase, lastC: boolean, lastS: boolean): void {
        const glyph = lastC && lastS ? '┗' : '┃';
        console.log(`${gray(glyph)}   - ${c.name}`)
        return
    }

    private result(c: TestCase, lastC: boolean, lastS: boolean): void {
        let glyph: string;
        if (c.error) {
            glyph = this.args.verbose[0] ? '┃' : '┗'
        } else {
            glyph = lastC && lastS ? '┗' : '┃';
        }

        const mark = c.result ? green('✓') : red('✗');
        if (!c.result || this.args.verbose[0]) {
            console.log(`${gray(glyph)}     ${mark} ${c.name}`);
            if (c.error && this.args.verbose[0]) {
                const ls = c.error
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0);

                if (ls.length > 1) {
                    const first = ls[0];
                    if (first.startsWith('Command failed: nix eval')) {
                        ls.shift();
                    }

                    for (const [i, l] of Object.entries(ls)) {
                        const lastL = parseInt(i) === ls.length - 1;
                        glyph = lastL && lastC && lastS ? '┗' : '┃';
                        console.log(`${yellow(glyph)}       ${yellow(italic(l))}`);
                    }
                }
            }
        }
        return
    }

    public run(args: CliArgs, testFiles: TestFile[], path: Path): void {
        this.args = args;
        this.files = testFiles;
        this.path = path;
        this.getProps();

        const renderFile = (f: TestFile): void => {
            const relativePath = f.path.replace(this.path, '');
            let ss = Object.entries(Object.entries(f.suites));
            if (!args.verbose[0]) {
                ss = ss.filter(([, [, s]]) => Object.values(s.cases).some(c => !c.result));
            }
            if (ss.length > 0) console.log(`${gray("┏")} ${magenta(relativePath)}`);
            for (const [indexStr, [, s]] of ss) {
                const index = parseInt(indexStr);
                const lastS = index === ss.length - 1;
                renderSuite(s, lastS);
            }
            return
        }

        const renderSuite = (s: TestSuite, lastS: boolean): void => {
            console.log(`${gray("┃")}   ${bold(s.name)}`);
            let cs = Object.entries(Object.entries(s.cases));
            for (const [indexStr, [, c]] of cs) {
                const index = parseInt(indexStr);
                const lastC = index === cs.length - 1;
                renderCase(c, lastC, lastS);
            }
            if (!lastS) {
                console.log(`${gray("┃")}`);
            } else {
                console.log("");
            }
            return
        }

        const renderCase = (c: TestCase, lastC: boolean, lastS: boolean): void => {
            if (args.list) {
                this.list(c, lastC, lastS);
            } else {
                this.result(c, lastC, lastS);
            }
        }

        const go = () => {
            console.log([
                `\nFound ${magenta(this.cases.length.toString())} cases`,
                `in ${magenta(this.suites.length.toString())} suites`,
                `over ${magenta(this.files.length.toString())} files.\n`,
            ].join(" "))


            for (const f of this.importSuccesses) {
                renderFile(f);
            }

            if (this.importFailures.length > 0) {
                console.log('');
                process.exitCode = 1;
                const warningGlyph = yellow("⚠");
                console.log(`  ${warningGlyph} Couldn't import ${magenta(this.importFailures.length.toString())} files:`);
                for (const file of this.importFailures) {
                    if (file.importError) {
                        let lines = file.importError.split("\n");
                        const filters = Object.values(warningFilters)
                        for (const filter of filters) {
                            const result = filter(lines);
                            if (result) {
                                lines = result;
                            }
                        }
                        console.log(`    - ${magenta(file.path)}`);
                        console.log(`      ${lines.join("\n      ")}`);
                    }
                    console.log('');
                }
            }
        }

        go();
        return
    }
}
