import path from 'path';
import chokidar from 'chokidar';

import { inject, injectable } from 'inversify';
import { IApp, IArgParser, ITestService } from '../interfaces';

import { CliArgs } from '../types';

import { findTests } from '../discovery';
import { ListingRenderer, ResultsRenderer } from '../rendering';
import { runTests } from '../running';

@injectable()
export class App implements IApp {
  private _argParser: IArgParser;
  private _testService: ITestService;

  private absolutePath: string;
  private args: CliArgs;
  private absoluteTestPath: string;

  constructor(
    @inject(IArgParser) argParser: IArgParser,
    @inject(ITestService) testService: ITestService
  ) {
    this.absolutePath = path.resolve(__filename);
    this._argParser = argParser;
    this.args = this._argParser.run();
    this.absoluteTestPath = path.resolve(this.args.path);
    this._testService = testService;
  }

  run() {
    const test = () => {
      this._testService.run(this.args);
    }

    // TODO rm, use test instead
    const go = () => {
      const testFiles = findTests(this.absoluteTestPath);

      let renderer;

      if (!this.args.list) {
        runTests(testFiles, this.args.verbose[1]);
        renderer = new ResultsRenderer(testFiles, this.absolutePath, this.args.verbose[0]);
        console.log("List is true");
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
