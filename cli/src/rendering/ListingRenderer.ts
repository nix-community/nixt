import { gray, bold } from '../colors';
import { TestSpec } from '../types';
import { BaseRenderer } from './BaseRenderer'


export class ListingRenderer extends BaseRenderer<TestSpec> {

    getSpecs() {
      return Object.values(this.testResult.results);
    }

    getSummary() {
      const totalSuites = this.specs.reduce((acc, spec) => {
        return acc + Object.keys(spec.suites).length;
      }, 0);
      const totalCases = this.specs.reduce((acc1, spec) => {
        return acc1 + Object.values(spec.suites).reduce((acc2, suite) => {
          return acc2 + suite.length;
        }, 0);
      }, 0);
      return {
        totalFiles: this.specs.length,
        totalSuites,
        totalCases,
        failedCases: 0,
        failedImports: this.testResult.importFailures.length,
      }
    }

    renderCase(name: string, index: number, last: boolean, lastSuite: boolean) {
      const glyph = lastSuite && last ? '┗' : '┃';
      console.log(`${gray(glyph)}     - ${name}`);
    }

    renderSuite(name: string, cases: string[], index: number, last: boolean) {
      console.log(`${gray('┃')}   ${bold(name)}`);
      for (const [indexStr, caseName] of Object.entries(cases)) {
        const index = parseInt(indexStr);
        const lastCase = index === cases.length - 1;
        this.renderCase(caseName, index, lastCase, last);
      }
    }
  }

