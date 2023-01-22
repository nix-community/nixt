import { provide } from "inversify-binding-decorators";
import { execSync } from "node:child_process";
import { INixService } from "../../interfaces.js";

const generateCallArgs = (args: {}): string[] => {
    return Object
        .entries(args)
        .map(([key, value]) => `--arg ${key} ${value}`);
}

@provide(INixService)
export class NixService implements INixService {
    public run(target: string, trace: boolean, args?: {}): any {
        const _args = args ? generateCallArgs(args).join(" ") : "";
        const traceString = trace ? `--show-trace` : '';
        const command = `nix eval --json ${traceString} ${target} ${_args}'`;

        const result = execSync(command, {
            stdio: ["pipe", "pipe", "pipe"]
        }).toString();

        if (result.startsWith("error:") === true) {
            throw new Error(result)
        }

        const parsed = JSON.parse(result);

        return parsed;
    }
}
