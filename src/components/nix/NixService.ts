import { injectable } from "inversify";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { INixService } from "../../interfaces.js";
import { NixOptions } from "../../types.js";

const generateCallArgs = (a: {}) => {
    return Object
        .entries(a)
        .map(([key, value]) => `${key} = "${value}";`);
}

@injectable()
export class NixService implements INixService {
    public eval(file: string, options: NixOptions): any {
        const nixPath = resolve(`nix/${file}`);

        if (!existsSync(nixPath)) {
            throw new Error(`Path "${nixPath}" is invalid`);
        };

        const args = options.args ? generateCallArgs(options.args) : [];
        const argsString = args.length > 0 ? `${args.join(' ')}` : '';
        const traceString = options.trace ? `--show-trace` : '';
        const expression = `import ${nixPath} { ${argsString} }`;
        const command = `nix eval --json --impure ${traceString} --expr '${expression}'`;

        const result = execSync(command, {
            stdio: ["pipe", "pipe", "pipe"]
        });

        const parsed = JSON.parse(result.toString());

        return parsed;
    }
}
