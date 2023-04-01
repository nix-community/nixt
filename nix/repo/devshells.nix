{
  inputs,
  cell,
}: let
  inherit (inputs) std;
  lib = inputs.nixpkgs.lib // builtins;
  presets = inputs.std-data-collection.data.configs;
in
  lib.mapAttrs (_: std.lib.dev.mkShell) {
    default = {
      name = "Node Template";
      nixago = with cell.configs; [
        editorconfig
        presets.conform
        presets.treefmt
      ];
    };
  }
