import { green, red, gray, bold, italic, yellow } from "../colors";
import { TestCase } from "../discovery";
import { BaseRenderer } from "./BaseRenderer";


export class ResultsRenderer extends BaseRenderer {
    renderCase(testCase: TestCase, index: number, lastCase: boolean, lastSuite: boolean) {
      const glyph = lastSuite && lastCase ? '┗' : '┃';
      const mark = testCase.result ? green('✓') : red('✗');
      console.log(`${gray(glyph)}     ${mark} ${testCase.name}`);
      if (testCase.error) {
        this.renderError(testCase.error, lastCase, lastSuite);
      }
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
  }