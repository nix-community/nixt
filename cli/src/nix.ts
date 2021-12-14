import { execSync } from "child_process";
import path, { resolve } from "path";

type NixOptions = {
  attr?: string;
  strict?: boolean;
  verbose?: number;
  debug?: boolean;
  args?: {};
}

export function nixPath(filePath: string) {
  return path.join(__dirname, "..", "nix", filePath);
}

export function nix(path: string, options: NixOptions) {
  const fullPath = nixPath(path);
  const args = options.args
    ? Object.entries(options.args).map(([key, value]) => `${key} = "${value}";`)
    : [];

  const argsString = args.length > 0 ? `${args.join(' ')}` : '';

  const verboseString = options.verbose || 0 > 1 ? `--show-trace` : '';

  const expression = `import ${fullPath} { ${argsString} }`

  const command = `nix eval --json --impure ${verboseString} --expr '${expression}'`;

  if (options.debug) {
    console.log(command);
  }

  // execute command, overriding stdout and stderr
  const result = execSync(command, {
    stdio: ["pipe", "pipe", "pipe"]
  });

  // parse result
  const parsed = JSON.parse(result.toString());

  if (options.debug) {
    console.log(parsed);
  }

  return parsed;
}

export function getTestSpec(filePath: string) {
  return nix("get-testspec.nix", {
    args: {
      path: resolve(filePath),
    }
  })
}

export function getTestSet(filePath: string) {
  return nix("get-testset.nix", {
    args: {
      path: resolve(filePath),
    }
  })
}
