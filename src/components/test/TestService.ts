import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { stat, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { INixService, TestService } from "../../interfaces.js";
import { CliArgs, TestFile } from "../../types.js";

@provide(TestService)
export class TestFinder implements TestService {
  private _nixService: INixService;

  public constructor(
    @inject(INixService) nixService: INixService
  ) {
    this._nixService = nixService;
  }

  public async run(args: CliArgs): Promise<TestFile[]> {
    let spec: TestFile[] = [];

    for (const path of args.paths) {
      const absolutePath = resolve(path);

      const files = await this.getFiles(args, absolutePath).then((files) =>
        files.filter((path) =>
          path.endsWith(".test.nix")
          || path.endsWith(".spec.nix")
        ));

      for (const file of files) {
        let testedFile: TestFile;

        testedFile = {
          path: absolutePath,
          suites: [],
        }

        try {
          testedFile = await this._nixService.inject(file, args.verbose[1]!)
        } catch (error: any) {
          testedFile.importError = error.message;
        }

        spec.push(testedFile)
      }
    }

    return spec
  }

  private async getFiles(args: CliArgs, path: string): Promise<string[]> {
    let files: string[] = [];

    try {
      const stats = await stat(path);

      if (stats.isFile()) files = [path];

      if (stats.isDirectory()) {
        const read = await readdir(path).then((files) => files.map((file) => `${path}/${file}`));

        files = read.filter((file) => stat(file).then((file) => file.isFile()));
        const dirs = read.filter((file) => stat(file).then((file) => file.isDirectory()));

        if (args.recurse && dirs.length > 0) {
          const newFiles = await Promise.all(dirs.map((dir) => this.getFiles(args, dir)));
          files = files.concat(newFiles.flat());
        }
      }
    } catch (error: any) {
      if (error.code === "ENOENT") {
        console.log(`File does not exist: ${path}`);
      }
      else {
        console.log(`IO error: ${error.code}`);
      }
    }

    return files;
  }
}
