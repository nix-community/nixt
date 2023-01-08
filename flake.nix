{
  description = "Test-runner for Nix";

  inputs = {
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };

    std.url = "github:divnix/std";

    nixpkgs.url = "nixpkgs";

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
      cellsFrom = ./cells;
      cellBlocks = with std.blockTypes; [
        (installables "packages" {ci.build = true;})
        (devshells "devshells")
        (functions "dream2nix")
        (nixago "configs")
      ];
    }
      {
        packages = std.harvest self ["nixt" "packages"];
        devShells = std.harvest self ["nixt" "devshells"];
      };
}
