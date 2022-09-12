import chokidar from 'chokidar';

import { inject, injectable } from 'inversify';
import { IApp, IArgParser, IRenderService, ITestFinder, ITestRunner } from '../interfaces.js';
import { CliArgs } from '../types.js';

@injectable()
export class App implements IApp {
  private _argParser: IArgParser;
  private _testRunner: ITestRunner;
  private _renderService: IRenderService;
  private _testFinder: ITestFinder;

  private args: CliArgs;

  public constructor(
    @inject(IArgParser) argParser: IArgParser,
    @inject(ITestRunner) testRunner: ITestRunner,
    @inject(IRenderService) renderService: IRenderService,
    @inject(ITestFinder) testFinder: ITestFinder
  ) {
    this._argParser = argParser;
    this._testRunner = testRunner;
    this._renderService = renderService;
    this._testFinder = testFinder;

    this.args = this._argParser.run();
  }

  public run() {
    const test = async () => {
      if (this.args.debug) console.log("Finding files!");
      const testFiles = await this._testFinder.run(this.args);

      if (!this.args.list) {
        if (this.args.debug) console.log("Running tests!");
        await this._testRunner.run(this.args, testFiles);
      }

      if (this.args.debug) console.log("Rendering!")
      this._renderService.run(this.args, testFiles);
    }

    if (this.args.watch) {
      console.clear();
      chokidar.watch(this.args.paths, { ignoreInitial: true })
        .on('all', (event: string, path: string) => {
          console.clear();
          if (this.args.debug) console.log(event, path);
          test()
        });
    }

    test()
    return
  }
}
