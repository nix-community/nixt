{ pkgs ? import <nixpkgs> {} }:

let
  nixt-pkg = pkgs.callPackage ./cli { inherit pkgs; };
in
  nixt-pkg.package
