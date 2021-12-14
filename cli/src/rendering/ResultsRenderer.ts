import { green, red, gray, bold } from "../colors";
import { TestSet } from "../types";
import { BaseRenderer } from "./BaseRenderer";


export class ResultsRenderer extends BaseRenderer<TestSet> {

    getSpecs() {
      return Object.values(this.testResult.results);
    }

    getSummary() {
      const totalSuites = this.specs.reduce((acc, spec) => {
        return acc + Object.keys(spec.suites).length;
      }, 0);
      const totalCases = this.specs.reduce((acc1, spec) => {
        return acc1 + Object.values(spec.suites).reduce((acc2, suite) => {
          return acc2 + Object.values(suite).length;
        }, 0);
      }, 0);
      const failedCases = this.specs.reduce((acc1, spec) => {
        return acc1 + Object.values(spec.suites).reduce((acc2, suite) => {
          return acc2 + Object.values(suite).filter(x => !x).length;
        }, 0);
      }, 0);
      return {
        totalFiles: this.specs.length,
        totalSuites,
        totalCases,
        failedCases,
        failedImports: this.testResult.importFailures.length,
      };
    }

    renderCase(name: string, index: number, passed: boolean, lastCase: boolean, lastSuite: boolean) {
      const glyph = lastSuite && lastCase ? '┗' : '┃';
      const mark = passed ? green('✓') : red('✗');
      console.log(`${gray(glyph)}     ${mark} ${name}`);
    }

    renderSuite(name: string, cases: Record<string, boolean>, suiteIndex: number, lastSuite: boolean) {
      const caseEntries = Object.entries(cases);
      const nCases = caseEntries.length;
      console.log(`${gray('┃')}   ${bold(name)}`);
      for (const [indexStr, [caseName, passed]] of Object.entries(caseEntries)) {
        const index = parseInt(indexStr);
        const lastCase = index === nCases - 1;
        this.renderCase(caseName, index, passed, lastCase, lastSuite);
      }
    }

    renderSummary() {
      super.renderSummary();
      const { failedCases } = this.getSummary();
      const any = failedCases > 0;
      const multiple = failedCases > 1;
      const noun = multiple ? 'cases' : 'case';
      const glyph = any ? red('✗') : green('✓');
      console.log(` ${glyph} ${bold(`${failedCases} failed ${noun}`)}\n`);
    }
  }