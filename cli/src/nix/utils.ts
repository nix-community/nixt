import path from "path";


export function nixPath(filePath: string) {
  return path.join(__dirname, "..", "..", "nix", filePath);
}

export function generateCallArgs(args: {}) {
  return Object
    .entries(args)
    .map(([key, value]) => `${key} = "${value}";`)
}