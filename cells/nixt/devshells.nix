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
      imports = [
        # FIXME: The std checks fail. Likely upstream.
        # std.std.devshellProfiles.default
        # d2n doesn't always use numtide/devshell which causes compatibility issues.
        # cell.dream2nix.outputs.devShells.${nixpkgs.system}.default
      ];
      packages = [
        nixpkgs.editorconfig-checker
      ];
      commands = [
        {package = nixpkgs.nodePackages.npm;}
        {package = nixpkgs.nodejs;}
      ];
      nixago = [
        cell.configs.treefmt
        cell.configs.lefthook
      ];
    };
  }
