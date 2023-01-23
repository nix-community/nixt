import { provide } from "inversify-binding-decorators";
import { execSync } from "node:child_process";
import { INixService } from "../../interfaces.js";

const runCommand = (command: string) => {
  const result = execSync(command, {
    stdio: ["pipe", "pipe", "pipe"]
  }).toString();

  if (result.startsWith("error:") === true) {
    throw new Error(result)
  }

  const parsed = JSON.parse(result);

  return parsed;
}

@provide(INixService)
export class NixService implements INixService {
  public fetch(target: string, trace: boolean): any {
    const traceString = trace ? `--show-trace` : '';
    const command = `nix eval --json ${traceString} ${target}`;

    const parsed = runCommand(command);

    return parsed;
  }

  public inject(target: string, trace: boolean): any {
    const traceString = trace ? `--show-trace` : '';
    const command = `nix eval --json --impure ${traceString} --expr \
'let inherit (import ./default.nix) lib; in lib.inject ${target}'`;

    const parsed = runCommand(command);

    return parsed;
  }
}
