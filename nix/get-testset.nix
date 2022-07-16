{ pkgs ? import <nixpkgs> { }, path }:

with pkgs.lib;
with (import ./utils.nix { inherit pkgs; });

let
    _mkSingleSuite = path: name: cases: {
      inherit path;
      suites = {
        "${name}" = cases;
      };
    };

    _mkSuites = path: suites: {
      inherit path suites;
    };

in import path {
  nixt = rec {
    mkSuite = _mkSingleSuite path;
    mkSuites = _mkSuites path;
  };
}
