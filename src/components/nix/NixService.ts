import { injectable } from "inversify";
import { INixService } from "../../interfaces.js";
import { NixOptions, Path } from "../../types.js";
import { execSync } from "node:child_process";
import { join } from "node:path";

@injectable()
export class NixService implements INixService {
  public eval(file: Path, options: NixOptions): any {
    const nixPath = (f: Path) => {
      return join(import.meta.url.replace("file:", ""), "..", "..", "..", "nix", f);
    }

    const generateCallArgs = (a: {}) => {
      return Object
        .entries(a)
        .map(([key, value]) => `${key} = "${value}";`);
    }

    if (options.debug) console.log(options);
    const fullPath = nixPath(file);
    const args = options.args ? generateCallArgs(options.args) : [];

    if (options.debug) console.log(args);
    const argsString = args.length > 0 ? `${args.join(' ')}` : '';
    const traceString = options.trace ? `--show-trace` : '';
    const expression = `import ${fullPath} { ${argsString} }`;
    const command = `nix eval --json --impure ${traceString} --expr '${expression}'`;

    const result = execSync(command, {
      stdio: ["pipe", "pipe", "pipe"]
    });

    const parsed = JSON.parse(result.toString());

    if (options.debug) {
      console.log(command);
      console.log(parsed);
    }

    return parsed;
  }
}
