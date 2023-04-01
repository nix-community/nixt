{
  description = "Test-runner for Nix";

  inputs = {
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };

    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    std = {
      url = "github:divnix/std";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    std-data-collection = {
      url = "github:divnix/std-data-collection";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        std.follows = "std";
      };
    };

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
        # repo
        (devshells "devshells")
        (nixago "configs")
        (functions "toolchain")
        (data "tests")

        # app
        (installables "packages")

        # lib
        (functions "nixt")
      ];
    }
    {
      packages = std.harvest self ["app" "packages"];
      devShells = std.harvest self ["repo" "devshells"];
      lib = std.pick self ["lib" "nixt"];
      __nixt = std.pick self ["lib" "tests"];
    };
}
