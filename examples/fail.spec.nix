{
  nixt,
  pkgs ? import <nixpkgs> {},
}:
nixt.block ./fail.spec.nix {
  "Failing Test" = {
    "always fails" = false;
  };
}
