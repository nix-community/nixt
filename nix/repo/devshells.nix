{
  inputs,
  cell,
}: let
  inherit (inputs) std nixpkgs;
  lib = nixpkgs.lib // builtins;
  presets = inputs.std-data-collection.data.configs;
in
  lib.mapAttrs (_: std.lib.dev.mkShell) {
    default = {
      name = "Node Template";
      commands = [
        {package = inputs.cells.app.packages.default;}
        {
          name = "prefetch";
          help = "prefetch npm deps.";
          command = ''${lib.getExe nixpkgs.prefetch-npm-deps} "$PRJ_ROOT"/package-lock.json | tail -1 > "$PRJ_ROOT"/nix/app/depsHash.txt'';
        }
        {
          name = "upd";
          help = "Update packages and prefetch.";
          command = ''npm update && prefetch'';
        }
      ];
      nixago = with cell.configs; [
        editorconfig
        presets.conform
        presets.treefmt
      ];
    };
  }
