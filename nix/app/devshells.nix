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
        # FIXME: std test times out
        # std.std.devshellProfiles.default
        # d2n doesn't always use numtide/devshell which causes compatibility issues.
        # cell.dream2nix.devShells.${nixpkgs.system}.default
      ];
      packages = [
        nixpkgs.nodejs
      ];
      commands = [
        {package = nixpkgs.nodePackages.npm;}
      ];
      nixago = [
        cell.configs.treefmt
        cell.configs.lefthook
      ];
    };
  }
