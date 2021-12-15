import { bold, magenta, yellow, gray } from "../colors";
import { TestCase, TestFile, TestSuite } from "../discovery";
import * as warningFilters from "./warningFilters";

export abstract class BaseRenderer {
  root: string;
  verbose: boolean;

  allFiles: TestFile[];
  allSuites: TestSuite[];
  allCases: TestCase[];

  importFailures: TestFile[];
  importSuccesses: TestFile[];
  failedCases: TestCase[];

  constructor(testFiles: TestFile[], root: string, verbose = false) {
    this.root = root;
    this.verbose = verbose;

    this.allFiles = testFiles;
    this.allSuites = this.getSuites();
    this.allCases = this.getCases();

    this.importFailures = this.getImportFailures();
    this.importSuccesses = this.getImportSuccesses();
    this.failedCases = this.getFailedCases();
  }

  getSuites() {
    const suites = [];
    for (const file of this.allFiles) {
      for (const suite of Object.values(file.suites)) {
        suites.push(suite);
      }
    }
    return suites;
  }

  getCases() {
    const cases = [];
    for (const file of this.allFiles) {
      for (const suite of Object.values(file.suites)) {
        for (const caseName in suite.cases) {
          cases.push(suite.cases[caseName]);
        }
      }
    }
    return cases;
  }

  getImportSuccesses() {
    return this.allFiles.filter(file => !file.importError);
  }

  getImportFailures() {
    return this.allFiles.filter(file => file.importError);
  }

  getFailedCases() {
    return this.allCases.filter(
      testCase => testCase.error || !testCase.result
    );
  }

  renderSummary() {
    console.log([
      `\nFound ${magenta(this.allCases.length)} cases`,
      `in ${magenta(this.allSuites.length)} suites`,
      `over ${magenta(this.allFiles.length)} files.\n`,
    ].join(" "));
  }

  renderWarnings() {
    if (this.importFailures.length > 0) {
      const warningGlyph = yellow('⚠')
      console.log(` ${warningGlyph} Couldn't import ${magenta(this.importFailures.length)} files:`);
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
          console.log(`   - ${magenta(file.path)}`);
          console.log(`     ${lines.join("\n     ")}`);
        }
      }
    }
  }

  renderFile(file: TestFile) {
    const relativePath = file.path.replace(this.root, '');
    console.log(`${gray('┏')} ${magenta(relativePath)}`);
    const suitesArray = Object.entries(Object.entries(file.suites))
    for (const [indexStr, [suiteName, suite]] of suitesArray) {
      const index = parseInt(indexStr);
      const last = index === suitesArray.length - 1;
      this.renderSuite(suite, index, last);
    }
    console.log("")
  }

  renderSuite(testSuite: TestSuite, index: number, lastSuite: boolean) {
    console.log(`${gray('┃')}   ${bold(testSuite.name)}`);
    const cases = Object.entries(testSuite.cases);
    for (const [indexStr, [caseName, testCase]] of Object.entries(cases)) {
      const index = parseInt(indexStr);
      const lastCase = index === cases.length - 1;
      this.renderCase(testCase, index, lastCase, lastSuite);
    }
  }

  abstract renderCase(testCase: TestCase, index: number, lastCase: boolean, lastSuite: boolean): void;

  render() {
    this.renderSummary();
    for (const file of this.importSuccesses) {
      this.renderFile(file);
    }
    if (this.verbose) {
      this.renderWarnings();
    }
    console.log("")
  }
}