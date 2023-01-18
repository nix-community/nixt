import { provide } from "inversify-binding-decorators";
import { execSync } from "node:child_process";
import { INixService } from "../../interfaces.js";
import { NixOptions } from "../../types.js";

const generateCallArgs = (args: {}): string[] => {
    return Object
        .entries(args)
        .map(([key, value]) => `--arg ${key} ${value}`);
}

@provide(INixService)
export class NixService implements INixService {
    public run(target: string, options: NixOptions): any {
        const args = options.args ? generateCallArgs(options.args).join(" ") : '';
        const traceString = options.trace ? `--show-trace` : '';
        const command = `nix eval --json ${traceString} ${target} ${args}'`;

        const result = execSync(command, {
            stdio: ["pipe", "pipe", "pipe"]
        });

        const parsed = JSON.parse(result.toString());

        return parsed;
    }
}
