{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs std self;
  lock = builtins.fromJSON (builtins.readFile (self + "/package-lock.json"));
  inherit (lock) name version;
in rec {
  default = nixpkgs.buildNpmPackage {
    pname = name;
    inherit version;

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
