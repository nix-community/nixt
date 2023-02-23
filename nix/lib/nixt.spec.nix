{
  inputs,
  cell,
}: let
  inherit (cell) nixt;
in
  nixt.block ./nixt.spec.nix {
    "nixt" = {
      "passes this test" = 2 + 2 == 4;
      "fails this test" = (2 + 2 == 5) == false;
    };
    "grow" = {};
    "block" = {};
    "inject" = {};
  }
