import path from "path";

import { injectable } from "inversify";
import { INixService } from "../interfaces";

import { NixOptions, Path } from "../types";
import { execSync } from "child_process";

const nixPath = (f: Path) => {
    return path.join(__dirname, "..", "..", "nix", f);
}

const generateCallArgs = (a: {}) => {
    return Object
        .entries(a)
        .map(([key, value]) => `${key} = "${value}";`);
}

@injectable()
export class NixService implements INixService {
    eval(path: Path, options: NixOptions) {
        const fullPath = nixPath(path);
        const args = options.args ? generateCallArgs(options.args) : [];

        const argsString = args.length > 0 ? `${args.join(' ')}` : '';
        const traceString = options.trace ? `--show-trace` : '';
        const expression = `import ${fullPath} { ${argsString} }`;
        const command = `nix eval --json --impure ${traceString} --expr '${expression}'`;

        if (options.debug) {
            console.log(command);
        }

        const result = execSync(command, {
            stdio: ["pipe", "pipe", "pipe"]
        });

        const parsed = JSON.parse(result.toString());

        if (options.debug) {
            console.log(parsed);
        }

        return parsed;
    }
}
