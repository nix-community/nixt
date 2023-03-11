{
  nixt,
  pkgs ? import <nixpkgs> {},
}:
nixt.block {
  "Undefined Test" = {
    "always undefined" = baz;
  };
}
