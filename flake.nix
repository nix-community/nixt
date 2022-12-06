{
  description = "Test-runner for Nix";

  inputs = {
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };

    dream2nix = {
      url = "github:nix-community/dream2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    flake-utils,
    dream2nix,
    ...
  }: let
    projectRoot = builtins.path {
      path = ./.;
      name = "projectRoot";
    };

    d2nFlake = dream2nix.lib.makeFlakeOutputs {
      systems = flake-utils.lib.defaultSystems;
      config.projectRoot = projectRoot;
      source = projectRoot;
      settings = [
        {
          subsystemInfo.nodejs = 18;
        }
      ];
    };
  in
    dream2nix.lib.dlib.mergeFlakes [
      d2nFlake
      (flake-utils.lib.eachDefaultSystem (system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = d2nFlake.devShells.${system}.default.overrideAttrs (old: {
          buildInputs =
            old.buildInputs
            ++ [
              pkgs.treefmt
              pkgs.alejandra
              pkgs.nodePackages.prettier
              pkgs.editorconfig-checker
            ];
        });
      }))
    ];
}
