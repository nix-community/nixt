import colors from "colors";
import { fluentProvide } from "inversify-binding-decorators";
import { IRenderService } from "../../interfaces.js";
import { CliArgs, TestCase, TestFile, TestSuite } from "../../types.js";
import * as warningFilters from './warningFilters/index.js';

type Data = {
  args: CliArgs;
  files: TestFile[];
  suites: TestSuite[];
  cases: TestCase[];
  importSuccesses: TestFile[];
  importFailures: TestFile[];
}

@fluentProvide(IRenderService).whenTargetTagged("ink", false).done()
export class RenderService implements IRenderService {
  private getData(args: CliArgs, files: TestFile[]): Data {
    const suites = [];
    const cases = [];

    for (const f of files) {
      for (const s of Object.values(f.suites)) {
        suites.push(s);
        for (const c of Object.values(s.cases)) {
          cases.push(c);
        }
      }
    }

    const importSuccesses = files.filter(f => !f.importError);
    const importFailures = files.filter(f => f.importError);

    const data = {
      args: args,
      files: files,
      suites: suites,
      cases: cases,
      importSuccesses: importSuccesses,
      importFailures: importFailures
    }

    return data
  }

  private list(c: TestCase, lastC: boolean, lastS: boolean): void {
    const glyph = lastC && lastS ? '┗' : '┃';
    console.log(`${colors.gray(glyph)}   - ${c.name}`)

    return
  }

  private result(args: CliArgs, testCase: TestCase, lastCase: boolean, lastSuite: boolean): void {
    let glyph: string;
    if (testCase.error) {
      process.exitCode = 1
    }

    glyph = lastSuite && lastCase && !testCase.error ? '┗' : '┃';
    const mark = testCase.result ? colors.green('✓') : colors.red('✗');
    if (!testCase.result || args.verbose[0]) {
      console.log(`${colors.gray(glyph)}     ${mark} ${testCase.name}`);
    }

    if (testCase.error && args.verbose[0]) {
      const lines: string[] = testCase.error
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length > 1) {
        if (lines[0]?.startsWith('Command failed: nix eval')) {
          lines.shift();
        }

        for (const [i, line] of Object.entries(lines)) {
          const lastLine = parseInt(i) === lines.length - 1;
          glyph = lastLine && lastCase && lastSuite ? '┗' : '┃';
          console.log(`${colors.yellow(glyph)}       ${colors.yellow(colors.italic(line))}`);
        }
      }
    }

    return
  }

  public run(args: CliArgs, testFiles: TestFile[]): void {
    const data = this.getData(args, testFiles);

    const renderFile = (f: TestFile): void => {
      let relativePath = f.path;
      for (const p in args.paths) {
        relativePath = relativePath.replace(p, '');
      }

      let ss = Object.entries(Object.entries(f.suites));
      if (!args.verbose[0]) {
        ss = ss.filter(([, [, s]]) => Object.values(s.cases).some(c => !c.result));
      }
      if (ss.length > 0) console.log(`${colors.gray("┏")} ${colors.magenta(relativePath)}`);
      for (const [indexStr, [, s]] of ss) {
        const index = parseInt(indexStr);
        const lastS = index === ss.length - 1;
        renderSuite(s, lastS);
      }
      return
    }

    const renderSuite = (s: TestSuite, lastS: boolean): void => {
      console.log(`${colors.gray("┃")}   ${colors.bold(s.name)}`);
      let cs = Object.entries(Object.entries(s.cases));
      for (const [indexStr, [, c]] of cs) {
        const index = parseInt(indexStr);
        const lastC = index === cs.length - 1;
        renderCase(c, lastC, lastS);
      }
      if (!lastS) {
        console.log(`${colors.gray("┃")}`);
      } else {
        console.log("");
      }
      return
    }

    const renderCase = (c: TestCase, lastC: boolean, lastS: boolean): void => {
      if (args.list) {
        this.list(c, lastC, lastS);
      } else {
        this.result(args, c, lastC, lastS);
      }
    }

    const go = () => {
      console.log([
        `\nFound ${colors.magenta(data.cases.length.toString())} cases`,
        `in ${colors.magenta(data.suites.length.toString())} suites`,
        `over ${colors.magenta(data.files.length.toString())} files.\n`,
      ].join(" "))


      for (const f of data.importSuccesses) {
        renderFile(f);
      }

      if (data.importFailures.length > 0) {
        process.exitCode = 1;

        console.log('');
        const warningGlyph = colors.yellow("⚠");
        const failCountString = data.importFailures.length.toString();

        console.log(`  ${warningGlyph} Couldn't import ${colors.magenta(failCountString)} files:`);

        for (const f of data.importFailures) {
          if (f.importError) {
            let lines = f.importError.split("\n");
            const filters = Object.values(warningFilters)
            for (const filter of filters) {
              const result = filter(lines);
              if (result) {
                lines = result;
              }
            }

            console.log(`    - ${colors.magenta(f.path)} `);
            console.log(`      ${lines.join("\n      ")} `);
          }
          console.log('');
        }
      }
    }

    go();
    return
  }
}
