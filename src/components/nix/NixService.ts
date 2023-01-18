import { provide } from "inversify-binding-decorators";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { INixService } from "../../interfaces.js";
import { NixOptions } from "../../types.js";

const generateCallArgs = (a: {}) => {
    return Object
        .entries(a)
        .map(([key, value]) => `${key} = "${value}";`);
}

@provide(INixService)
export class NixService implements INixService {
    public run(target: string, options: NixOptions): any {
        const nixPath = resolve(`nix/${target}`);

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
