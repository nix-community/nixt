{
  inputs,
  cell,
}: let
  inherit (cell.nixt) block describe;
in
  block (
    describe "nixt" {
      "passes this test" = 2 + 2 == 4;
      "fails this test" = 2 + 2 == 5;
    }
  )
