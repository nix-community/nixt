{ pkgs ? import <nixpkgs> {} }:
with builtins;
with pkgs.lib;
let
  version = readFile ./VERSION;
in pkgs.stdenv.mkDerivation {
  name = "nixt-${version}";
  version = version;
  src = ./nix;
  phases = ["buildPhase"];
  buildPhase = ''
    mkdir -p $out/bin
    cp -r $src/* $out
    EXPR="(import $out/nixt.nix { args = \"'\$@'\"; })"
    echo "#!${pkgs.stdenv.shell}
    ${pkgs.nix}/bin/nix eval --json --show-trace '$EXPR'" > $out/bin/nixt
    chmod +x $out/bin/nixt
  '';
}
