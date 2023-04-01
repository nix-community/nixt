import colors from "colors";
import { fluentProvide } from "inversify-binding-decorators";
import { IRenderService } from "../../interfaces.js";
import { CliArgs, TestCase, TestFile, TestSuite } from "../../types.js";
import * as warningFilters from "./warningFilters/index.js";

type Data = {
  args: CliArgs;
  files: TestFile[];
  suites: TestSuite[];
  cases: TestCase[];
  importSuccesses: TestFile[];
  importFailures: TestFile[];
};

function reduceExpressions(testCase: TestCase) {
  return testCase.expressions.reduce((accumulator, currentValue): boolean => {
    let result: boolean;

    accumulator
      ? currentValue
        ? (result = true)
        : (result = false)
      : (result = false);

    return result;
  });
}

@fluentProvide(IRenderService).whenTargetTagged("ink", false).done()
export class RenderService implements IRenderService {
  public run(args: CliArgs, testFiles: TestFile[]): void {
    const data = this.getData(args, testFiles);

    console.log(
      [
        `\nFound ${colors.magenta(data.cases.length.toString())} cases`,
        `in ${colors.magenta(data.suites.length.toString())} suites`,
        `over ${colors.magenta(data.files.length.toString())} files.\n`,
      ].join(" ")
    );

    for (const testFile of data.importSuccesses) {
      this.renderFile(args, testFile);
    }

    if (data.importFailures.length > 0) {
      process.exitCode = 1;

      console.log("");
      const warningGlyph = colors.yellow("⚠");
      const failCountString = data.importFailures.length.toString();

      console.log(
        `  ${warningGlyph} Couldn't import ${colors.magenta(
          failCountString
        )} files:`
      );

      for (const testFile of data.importFailures) {
        if (testFile.importError) {
          let lines = testFile.importError.split("\n");
          const filters = Object.values(warningFilters);
          for (const filter of filters) {
            const result = filter(lines);
            if (result) {
              lines = result;
            }
          }

          console.log(`    - ${colors.magenta(testFile.path)} `);
          console.log(`      ${lines.join("\n      ")} `);
        }
        console.log("");
      }
    }

    return;
  }

  private getData(args: CliArgs, files: TestFile[]): Data {
    const suites = [];
    const cases = [];

    for (const file of files) {
      for (const suite of Object.values(file.suites)) {
        suites.push(suite);
        for (const testCase of Object.values(suite.cases)) {
          cases.push(testCase);
        }
      }
    }

    const importSuccesses = files.filter((file) => !file.importError);
    const importFailures = files.filter((file) => file.importError);

    const data = {
      args: args,
      files: files,
      suites: suites,
      cases: cases,
      importSuccesses: importSuccesses,
      importFailures: importFailures,
    };

    return data;
  }

  private renderFile(args: CliArgs, testFile: TestFile): void {
    let relativePath = testFile.path;
    for (const p in args.paths) {
      relativePath = relativePath.replace(p, "");
    }

    let testSuites = Object.entries(Object.entries(testFile.suites));
    if (!args.verbose[0]) {
      testSuites = testSuites.filter(([, [, testSuite]]) =>
        Object.values(testSuite.cases).some(
          (testCase) => !reduceExpressions(testCase)
        )
      );
    }
    if (testSuites.length > 0)
      console.log(`${colors.gray("┏")} ${colors.magenta(relativePath)} `);
    for (const [indexStr, [, testSuite]] of testSuites) {
      const index = parseInt(indexStr);
      const lastSuite = index === testSuites.length - 1;
      this.renderSuite(args, testSuite, lastSuite);
    }
    return;
  }

  private renderSuite(
    args: CliArgs,
    testSuite: TestSuite,
    lastSuite: boolean
  ): void {
    console.log(`${colors.gray("┃")}   ${colors.bold(testSuite.name)} `);
    let testCases = Object.entries(Object.entries(testSuite.cases));
    for (const [indexStr, [, testCase]] of testCases) {
      const index = parseInt(indexStr);
      const lastCase = index === testCases.length - 1;
      args.list
        ? this.renderList(testCase, lastCase, lastSuite)
        : this.renderResult(args, testCase, lastCase, lastSuite);
    }

    !lastSuite ? console.log(`${colors.gray("┃")} `) : console.log("");
    return;
  }

  private renderList(
    testCase: TestCase,
    lastCase: boolean,
    lastSuite: boolean
  ): void {
    const glyph = lastCase && lastSuite ? "┗" : "┃";
    console.log(`${colors.gray(glyph)}   - ${testCase.name}`);

    return;
  }

  private renderResult(
    args: CliArgs,
    testCase: TestCase,
    lastCase: boolean,
    lastSuite: boolean
  ): void {
    let glyph: string;
    if (testCase.error || !reduceExpressions(testCase)) {
      process.exitCode = 1;
    }

    glyph = lastSuite && lastCase && !testCase.error ? "┗" : "┃";
    const mark = reduceExpressions(testCase)
      ? colors.green("✓")
      : colors.red("✗");
    if (!reduceExpressions(testCase) || args.verbose[0]) {
      console.log(`${colors.gray(glyph)}     ${mark} ${testCase.name} `);
    }

    if (testCase.error && args.verbose[0]) {
      const lines: string[] = testCase.error
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length > 1) {
        if (lines[0]?.startsWith("Command failed: nix eval")) {
          lines.shift();
        }

        for (const [i, line] of Object.entries(lines)) {
          const lastLine = parseInt(i) === lines.length - 1;
          glyph = lastLine && lastCase && lastSuite ? "┗" : "┃";
          console.log(
            `${colors.yellow(glyph)}       ${colors.yellow(
              colors.italic(line)
            )} `
          );
        }
      }
    }

    return;
  }
}
