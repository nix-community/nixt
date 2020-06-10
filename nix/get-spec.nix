{ pkgs ? import <nixpkgs> {}, path }:

with pkgs.lib;
with (import ./utils.nix { inherit pkgs; });

import path {
  nixt = {
    mkSuite = name: cases: { inherit name; cases = mapAttrsToList (k: v: k) cases; };
  };
}
