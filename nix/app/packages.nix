{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs std self;
in rec {
  default = nixt;
  nixt = nixpkgs.buildNpmPackage {
    pname = "nixt";
    version = "0.4.0";

    src = std.incl self [
      "package.json"
      "package-lock.json"
      "tsconfig.json"
      "src"
      "nix"
    ];

    # Read it from a separate file so that scripts can easily touch it.
    npmDepsHash = builtins.readFile ./depsHash.txt;
  };
}
