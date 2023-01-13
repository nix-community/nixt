{
  inputs,
  cell,
}:
cell.nixt.block ./nixt.spec.nix {
  "nixt" = {
    "passes this test" = 2 + 2 == 4;
    "fails this test" = 2 + 2 == 5;
  };
}
