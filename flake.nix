{
  description = "Test-runner for Nix";

  inputs = {
    nixpkgs.url = "nixpkgs";

    flake-utils.url = "github:numtide/flake-utils";

    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-utils, flake-compat }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        inherit (import ./default.nix { inherit pkgs; }) package shell;
        packageName = "nixt";
      in
      {
        packages = {
          default = self.packages.${system}.${packageName};
          ${packageName} = package;
        };

        apps = {
          default = self.apps.${system}.${packageName};
          ${packageName} = flake-utils.lib.mkApp {
            name = packageName;
            drv = package;
          };
        };

        devShells.default = shell;
      });
}
