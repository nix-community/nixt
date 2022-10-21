{ pkgs ? import <nixpkgs> { }, nixt }:

with pkgs.lib;

let sut = pkgs.callPackage ./fail.nix { };

in
nixt.mkSuites {
  "Undefined Test" = {
    "always undefined" = baz;
  };
}
