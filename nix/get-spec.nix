{ pkgs ? import <nixpkgs> {}, path }:

with pkgs.lib;
with (import ./utils.nix { inherit pkgs; });

import path {
  nixt = {
    mkSuite = name: cases: { 
      inherit name;
      cases = mapAttrsToList (
        testName: test:
          {
            src = path;
            case = testName;
            result = test;
          }
      ) cases;
    };
  };
}
