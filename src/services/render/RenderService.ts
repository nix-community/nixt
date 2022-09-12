import { injectable } from "inversify";
import { IRenderService } from "../../interfaces.js";
import { CliArgs, Path, TestCase, TestFile, TestSuite } from "../../types.js";

import colors from "colors";
import * as warningFilters from './warningFilters/index.js'

type Data = {
  args: CliArgs;
  files: TestFile[];
  suites: TestSuite[];
  cases: TestCase[];
  importSuccesses: TestFile[];
  importFailures: TestFile[];
}

@injectable()
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

  private result(args: CliArgs, c: TestCase, lastC: boolean, lastS: boolean): void {
    let glyph: string;
    if (c.error) {
      process.exitCode = 1
      glyph = args.verbose[0] ? '┃' : '┗'
    } else {
      glyph = lastC && lastS ? '┗' : '┃';
    }

    const mark = c.result ? colors.green('✓') : colors.red('✗');
    if (!c.result || args.verbose[0]) {
      console.log(`${colors.gray(glyph)}     ${mark} ${c.name}`);
    }

    if (c.error && args.verbose[0]) {
      const ls: string[] = c.error
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (ls.length > 1) {
        const first = ls[0];
        if (first.startsWith('Command failed: nix eval')) {
          ls.shift();
        }

        for (const [i, l] of Object.entries(ls)) {
          const lastL = parseInt(i) === ls.length - 1;
          glyph = lastL && lastC && lastS ? '┗' : '┃';
          console.log(`${colors.yellow(glyph)}       ${colors.yellow(colors.italic(l))}`);
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
