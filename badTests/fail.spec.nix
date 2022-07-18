{ pkgs ? import <nixpkgs> { }, nixt }:

with pkgs.lib;

let sut = pkgs.callPackage ./fail.nix { };

in nixt.mkSuites {
  "Broken Tests" = {
    "always fails" = false;
    "always undefined" = baz;
  };
}
