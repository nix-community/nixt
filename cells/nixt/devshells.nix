{ inputs, cell }:
let
  inherit (inputs) std nixpkgs;
  lib = nixpkgs.lib // builtins;
in
lib.mapAttrs (_: std.lib.dev.mkShell) {
  default = { ... }: {
    imports = [ std.std.devshellProfiles.default cell.dream2nix.outputs.devShells.${nixpkgs.system}.default ];
    packages = [
      nixpkgs.editorconfig-checker
    ];
    nixago = [
      cell.configs.treefmt
      cell.configs.lefthook
    ];
  };
}
