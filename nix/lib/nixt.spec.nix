{
  inputs,
  cell,
}: let
  inherit (cell) nixt;
in
  nixt.block ./nixt.spec.nix {
    "grow" = {};
    "block" = {};
    "inject" = {};
  }
