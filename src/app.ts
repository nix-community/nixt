import path from 'path';

import { injectable } from 'inversify';
import { INixtApp } from './interfaces';

import { NixtCliArgs, parseArgs } from './args';
import { findTests } from './discovery';
import { ListingRenderer, ResultsRenderer } from './rendering';
import { runTests } from './running';
import chokidar from 'chokidar';


@injectable()
export class NixtApp implements INixtApp {
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
    const go = () => {
      const testFiles = findTests(this.absoluteTestPath);

      let renderer;

      if (!this.args.list) {
        runTests(testFiles, this.args.verbose[1]);
        renderer = new ResultsRenderer(testFiles, this.absolutePath, this.args.verbose[0]);
      } else {
        renderer = new ListingRenderer(testFiles, this.absolutePath, this.args.verbose[0]);
      }

      renderer.render();
    }

    if (this.args.watch) {
      console.clear();
      chokidar.watch(this.args.path, { ignoreInitial: true }).on('all', (event, path) => {
        console.clear();
        if (this.args.debug) console.log(event, path);
        go()
      });
    }
    go();
  }
}
