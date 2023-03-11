{
  inputs,
  cell,
}: let
  inherit (inputs) std nixpkgs;
  lib = nixpkgs.lib // builtins;
in
  lib.mapAttrs (_: std.lib.dev.mkShell) {
    default = {...}: {
      name = "nixt";
      packages = [
        nixpkgs.nodejs
      ];
      commands = [
        {package = nixpkgs.nodePackages.npm;}
      ];
      nixago = [
        cell.configs.editorconfig
        cell.configs.treefmt
        cell.configs.lefthook
      ];
    };
  }
