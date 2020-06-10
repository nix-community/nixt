{ pkgs ? import <nixpkgs> {} }:

with builtins;
with pkgs.lib;

let
  deps = import ./nim-deps.nix { inherit pkgs; };
  depArgs = concatStringsSep " " (map (dep: "-p=${dep}") (attrValues deps));
  version = readFile ./VERSION;
in pkgs.stdenv.mkDerivation {
  name = "nixt-${version}";
  version = version;
  src = ./nim;

  phases = ["buildPhase"];

  buildPhase = ''
    mkdir -p $out/bin
    ${pkgs.nim}/bin/nim --nimcache:. ${depArgs} -o=$out/bin/_nixt c $src/nixt.nim
    echo "#!${pkgs.stdenv.shell}
    NIXT=${./nix} $out/bin/_nixt \$@" > $out/bin/nixt
    chmod +x $out/bin/nixt
  '';
}
