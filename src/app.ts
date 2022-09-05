import path from 'path';

import { inject, injectable } from 'inversify';
import { IArgParser, ICliArgs, INixtApp } from './interfaces';

import { findTests } from './discovery';
import { ListingRenderer, ResultsRenderer } from './rendering';
import { runTests } from './running';
import chokidar from 'chokidar';

@injectable()
export class NixtApp implements INixtApp {
  private _argParser: IArgParser
  private args: ICliArgs;
  private absoluteTestPath: string;
  private absolutePath: string;

  constructor(
    @inject(IArgParser) argParser: IArgParser
  ) {
    this._argParser = argParser;
    this.args = this._argParser.run();
    this.absoluteTestPath = path.resolve(this.args.path);
    this.absolutePath = path.resolve(__filename);
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
