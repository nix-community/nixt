{ pkgs ? import <nixpkgs> {}, path, case }:

with pkgs.lib;
with (import ./utils.nix { inherit pkgs; });

import path {
  nixt = {
    mkSuite = name: cases: attrByPath [ case ] false cases;
  };
}
