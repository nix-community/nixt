import { gray, bold } from '../colors';
import { TestCase } from '../types';
import { BaseRenderer } from './BaseRenderer'

export class ListingRenderer extends BaseRenderer {
    renderCase(testCase: TestCase, index: number, lastCase: boolean, lastSuite: boolean) {
        const glyph = lastSuite && lastCase ? '┗' : '┃';
        console.log(`${gray(glyph)}     - ${testCase.name}`);
    }

    render() {
        this.renderSummary();
        if (this.verbose) {
            console.log('')
            for (const file of this.importSuccesses) {
                this.renderFile(file);
            }
        }
        this.renderWarnings();
    }
}

