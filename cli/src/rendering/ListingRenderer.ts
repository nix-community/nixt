import { gray, bold } from '../colors';
import { TestCase } from '../discovery';
import { BaseRenderer } from './BaseRenderer'


export class ListingRenderer extends BaseRenderer {
    renderCase(testCase: TestCase, index: number, lastCase: boolean, lastSuite: boolean) {
      const glyph = lastSuite && lastCase ? '┗' : '┃';
      console.log(`${gray(glyph)}     - ${testCase.name}`);
    }
  }

