import { execSync } from "child_process";
import { NixOptions } from "./types";
import { generateCallArgs, nixPath } from "./utils";


export function nixEval(path: string, options: NixOptions) {
  const fullPath = nixPath(path);
  const args = options.args
    ? generateCallArgs(options.args)
    : [];

  const argsString = args.length > 0 ? `${args.join(' ')}` : '';
  const verboseString = options.verbose || 0 > 1 ? `--show-trace` : '';
  const expression = `import ${fullPath} { ${argsString} }`
  const command = `nix eval --json --impure ${verboseString} --expr '${expression}'`;

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


