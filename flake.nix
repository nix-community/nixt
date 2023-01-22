{
  description = "Test-runner for Nix";

  inputs = {
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };

    std.url = "github:divnix/std";

    nixpkgs.url = "nixpkgs";

    yants.url = "github:divnix/yants";

    dream2nix = {
      url = "github:nix-community/dream2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    std,
    self,
    ...
  } @ inputs:
    std.growOn {
      inherit inputs;
      cellsFrom = ./nix;
      cellBlocks = with std.blockTypes; [
        # app
        (installables "packages" {ci.build = true;})
        (devshells "devshells")
        (functions "dream2nix")
        (nixago "configs")

        # lib
        (functions "nixt")
        (data "tests")
      ];
    }
    {
      packages = std.harvest self ["app" "packages"];
      devShells = std.harvest self ["app" "devshells"];
      lib = std.pick self ["lib" "nixt"];
      __nixt = std.pick self ["lib" "tests"];
    };
}
