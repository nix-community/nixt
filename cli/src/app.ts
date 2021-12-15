import path from 'path';

import { NixtCliArgs, parseArgs } from './args';
import { findTests } from './discovery';
import { ListingRenderer, ResultsRenderer } from './rendering';
import { runTests } from './running';


export class NixtApp {
    args: NixtCliArgs;
    absoluteTestPath: string;
    absolutePath: string;
    nixPath: string;

    constructor() {
        this.args = parseArgs();
        this.absoluteTestPath = path.resolve(this.args.path);
        this.absolutePath = path.resolve(__filename);
        this.nixPath = path.resolve(this.absolutePath, '../../nix');
    }

    run() {
      const testFiles = findTests(this.absoluteTestPath);

      let renderer;

      if (!this.args.list) {
        runTests(testFiles);
        renderer = new ResultsRenderer(testFiles, this.absolutePath, this.args.verbose);
      } else {
        renderer = new ListingRenderer(testFiles, this.absolutePath, this.args.verbose);
      }

      renderer.render();
    }
}