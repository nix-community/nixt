import { magenta, yellow, gray } from "../colors";
import { TestData, TestResult } from "../types";
import { Summary } from "./Summary";

export type Cases<T extends TestData> = T["suites"][keyof T["suites"]]

export abstract class BaseRenderer<T extends TestData> {
    testResult: TestResult<T>;
    verbose: boolean;
    specs: T[];
    root: string;
    summary: Summary;

    constructor(testResult: TestResult<T>, root: string, verbose = false) {
      this.testResult = testResult;
      this.root = root;
      this.verbose = verbose;
      this.specs = this.getSpecs();
      this.summary = this.getSummary();
    }

    abstract getSpecs(): T[];
    abstract getSummary(): Summary;
    abstract renderSuite(name: string, suite: Cases<T>, index: number, last: boolean): void

    renderSummary() {
      const { totalFiles, totalSuites, totalCases } = this.getSummary();
      console.log([
        `\nFound ${magenta(totalCases)} cases`,
        `in ${magenta(totalSuites)} suites`,
        `over ${magenta(totalFiles)} files.\n`,
      ].join(" "));
    }

    renderWarnings() {
      if (this.testResult.importFailures.length > 0) {
        const warningGlyph = yellow('⚠')
        console.log(` ${warningGlyph} Couldn't import ${magenta(this.summary.failedImports)} files:`);
        for (const { file, error } of this.testResult.importFailures) {
          console.log(`   - ${magenta(file)}`);
          console.log(`     ${error.message}`);
        }
      }
    }

    renderTestData({ path, suites }: T) {
      const relativePath = path.replace(this.root, '');
      console.log(`${gray('┏')} ${magenta(relativePath)}`);
      const suitesArray = Object.entries(Object.entries(suites))
      for (const [indexStr, [name, suite]] of suitesArray) {
        const index = parseInt(indexStr);
        const last = index === suitesArray.length - 1;
        this.renderSuite(name, suite, index, last);
      }
      console.log("")
    }

    render() {
      this.renderSummary();
      for (const spec of this.testResult.results) {
        this.renderTestData(spec);
      }
      if (this.verbose) {
        this.renderWarnings();
      }
      console.log("")
    }
  }