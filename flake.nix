{
  description = "Test-runner for nixlang.";

  outputs = { self, nixpkgs }:
    let
      pkgs = import nixpkgs {};
      nixt-pkg = pkgs.callPackage ./default.nix { inherit pkgs; };
    in {

    packages.x86_64-linux.nixt = nixt-pkg;
    defaultPackage.x86_64-linux = nixt-pkg;
  };
}
