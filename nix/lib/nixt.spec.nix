{
  inputs,
  cell,
}: let
  inherit (cell.nixt) block block' describe it;
  sut = cell.nixt;
in
  block' ./nixt.spec.nix {
    "grow" = {};
    "block" = {};
    "describe" = {};
    "it" = {};
    # TODO Test that prime outputs match their non-prime counterparts
    "block'" = {};
    "describe'" = {};
    "it'" = {};
    "inject" = {};
  }
