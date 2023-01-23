import chokidar, { FSWatcher } from "chokidar";
import { inject, tagged } from "inversify";
import { provide } from "inversify-binding-decorators";
import { IApp, INixService, IRenderService, TestService } from "./interfaces.js";
import { CliArgs, Schema, schema, schemaVer } from "./types.js";

@provide(IApp)
export class App implements IApp {
  private _nixService: INixService;
  private _renderService: IRenderService;
  private _testService: TestService;
  private watcher: FSWatcher;

  public constructor(
    @inject(INixService) nixService: INixService,
    @inject(IRenderService) @tagged("ink", false) renderService: IRenderService,
    @inject(TestService) testService: TestService
  ) {
    this._nixService = nixService;
    this._renderService = renderService;
    this._testService = testService;
    this.watcher = chokidar.watch([], { ignoreInitial: true })
  }

  // TODO: Watch both test and non-test files when using registry.
  // This probably entails adding `settings.watchFiles` to the schema.
  // Currently, only test files are watched.
  public async run(args: CliArgs) {
    const schema = await this.fetchSchema(args)

    this.watcher.unwatch(args.paths);

    args.paths = [];
    for (const testFile of schema.testSpec) {
      args.paths.push(testFile.path)
    }

    if (args.watch === true || schema.settings.watch === true) {
      this.watcher.add(args.paths)
      this.watcher.on("all", () => {
        this.run(args);
      });
    }

    this._renderService.run(args, schema.testSpec);
  }

  private async fetchSchema(args: CliArgs): Promise<Schema> {
    let result: Schema;

    try {
      const registry = schema.safeParse(this._nixService.fetch(".#__nixt", false));

      if (args.paths.length > 0 || registry.success === false || registry.data.__schema !== schemaVer) {
        if (args.paths.length > 0) console.log("Path provided: standalone mode")
        if (registry.success === false) console.log("Registry non-conformant: standalone mode")
        else if (registry.data.__schema !== schemaVer) console.log("Schema mismatch: standalone mode")
        result = await this.buildSchema(args)
      } else {
        result = registry.data;
      }
    } catch (error: any) {
      console.log("Failed to access registry: standalone mode")
      result = await this.buildSchema(args)
    }

    return result
  }

  private async buildSchema(args: CliArgs): Promise<Schema> {
    return schema.parse({
      __schema: schemaVer,
      settings: {
        list: false,
        watch: false,
        verbose: false,
        trace: false
      },
      testSpec: await this._testService.run(args)
    })
  }
}
