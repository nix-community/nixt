import chokidar from "chokidar";
import { inject, tagged } from "inversify";
import { provide } from "inversify-binding-decorators";
import { IApp, INixService, IRenderService, ITestFinder } from "./interfaces.js";
import { CliArgs, NixOptions, schema, TestFile } from "./types.js";

@provide(IApp)
export class App implements IApp {
    private _nixService: INixService;
    private _renderService: IRenderService;
    private _testFinder: ITestFinder;

    public constructor(
        @inject(INixService) nixService: INixService,
        @inject(IRenderService) @tagged("ink", false) renderService: IRenderService,
        @inject(ITestFinder) testFinder: ITestFinder
    ) {
        this._nixService = nixService;
        this._renderService = renderService;
        this._testFinder = testFinder;
    }

    public run(args: CliArgs) {
        let standalone: boolean = false;
        let standaloneCause: string = "Unknown cause";
        const schemaVer: string = "v0.0";
        let spec: TestFile[] = [];

        const registry = schema.safeParse(this._nixService.run(".#__nixt", {} as NixOptions));

        // Run in standalone mode?
        if (args.paths.length > 0) {
            standalone = true;
            standaloneCause = "Path provided";
        } else if (registry.success === false) {
            standalone = true;
            args.paths = ["."];
            standaloneCause = "nixt registry does not contain expected values";
        } else if (registry.data.__schema !== schemaVer) {
            standalone = true;
            args.paths = ["."];
            standaloneCause = `nixt schema version ${registry.data.__schema} is not ${schemaVer}`;
        } else {
            spec = registry.data.testSpec
        }

        if (standalone === true) {
            console.log(`${standaloneCause}: running in standalone mode.`);
            this._testFinder.run(args)
                .then((testSpec: TestFile[]) => spec = testSpec);
        }

        // Watch?
        args.watch
            ? this.watching(args, spec)
            : this.reporting(args, spec)
    }

    public watching(args: CliArgs, spec: TestFile[]) {
        const watcher = chokidar.watch(args.paths, { ignoreInitial: true });
        this.reporting(args, spec);
        watcher.on("all", () => {
            this.reporting(args, spec);
        });
    }

    public reporting(args: CliArgs, spec: TestFile[]) {
        this._renderService.run(args, spec);
    }
}
