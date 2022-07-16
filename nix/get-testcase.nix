{ pkgs ? import <nixpkgs> {}, path, suite, case }:

let
  testset = import ./get-testset.nix { inherit pkgs path; };
in
  testset.suites."${suite}"."${case}"