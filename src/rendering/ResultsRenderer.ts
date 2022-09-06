import { green, red, gray, bold, italic, yellow, magenta } from "../colors";
import { TestCase, TestFile } from "../types";
import { BaseRenderer } from "./BaseRenderer";


export class ResultsRenderer extends BaseRenderer {
  renderCase(testCase: TestCase, index: number, lastCase: boolean, lastSuite: boolean) {
    const glyph = lastSuite && lastCase ? '┗' : '┃';
    const mark = testCase.result ? green('✓') : red('✗');
    if (!testCase.result || this.verbose) {
      console.log(`${gray(glyph)}     ${mark} ${testCase.name}`);
      if (testCase.error && this.verbose) {
        this.renderError(testCase.error, lastCase, lastSuite);
      }
    }
  }

  renderFile(file: TestFile) {
    const relativePath = file.path.replace(this.root, '');
    console.log(`${gray('┏')} ${magenta(relativePath)}`);
    let suitesArray = Object.entries(Object.entries(file.suites))
    if (!this.verbose) {
      suitesArray = suitesArray.filter(([, [, suite]]) =>
        Object.values(suite.cases).some(testCase => !testCase.result)
      );
    }
    for (const [indexStr, [suiteName, suite]] of suitesArray) {
      const index = parseInt(indexStr);
      const last = index === suitesArray.length - 1;
      this.renderSuite(suite, index, last);
    }
    console.log("")
  }

  renderError(error: string, lastCase: boolean, lastSuite: boolean) {
    const lines =
      error
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    if (lines.length > 1) {
      const first = lines[0];
      if (first.startsWith('Command failed: nix eval')) {
        lines.shift();
      }

      for (const [index, line] of Object.entries(lines)) {
        const lastLine = parseInt(index) === lines.length - 1;
        const glyph = lastLine && lastCase && lastSuite ? '┗' : '┃';
        console.log(`${gray(glyph)}       ${yellow(italic(line))}`);
      }
    }
  }

  renderSummary() {
    super.renderSummary();
    const nFailedCases = this.failedCases.length;
    let glyph = green('✓');
    if (nFailedCases > 0) {
      process.exitCode = 1;
      glyph = red('✗');
    }
    console.log(`  ${glyph} ${magenta(nFailedCases)} cases failed.`);
  }
}
