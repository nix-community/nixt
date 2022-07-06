{
  description = "Test-runner for nixlang.";

  inputs.fu.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, fu }:
    fu.lib.eachSystem [ fu.lib.system.x86_64-linux ] (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nixt-pkg = pkgs.callPackage ./default.nix { inherit pkgs; };
      in {
        packages.default = nixt-pkg;
        devShells.default = import ./cli/shell.nix { inherit pkgs; };
      });
}
