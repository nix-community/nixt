{
  nixt,
  pkgs ? import <nixpkgs> {},
}:
nixt.block' ./valid.nixt {
  "Valid Tests" = {
    "always passes" = true;
  };
}
