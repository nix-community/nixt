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
      systems = [ "x86_64-linux" "x86_64-darwin" ];
      config.projectRoot = projectRoot;
      source = projectRoot;
    };
}
