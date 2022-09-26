{
  description = "Test-runner for Nix";

  inputs = {
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };

    nixpkgs.url = "nixpkgs";

    dream2nix = {
      url = "github:nix-community/dream2nix";
      inputs = {
        nixpkgs.follows = "nixpkgs";
      };
    };
  };

  outputs = { dream2nix, nixpkgs, ... }:
    let
      projectRoot = builtins.path { path = ./.; name = "projectRoot"; };
    in
    dream2nix.lib.makeFlakeOutputs {
      systems = [
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
        "x86_64-linux"
      ];
      config.projectRoot = projectRoot;
      source = projectRoot;
      settings = [
        {
          subsystemInfo.nodejs = 18;
        }
      ];
    };
}
