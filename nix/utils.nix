{ pkgs ? import <nixpkgs> {} }:

with builtins;
with pkgs.lib;

rec {
  getDir = dir:
    mapAttrs
      (file: type: if type == "directory" then getDir "${dir}/${file}" else type)
    (readDir dir);

  dirFiles = dir:
    collect isString
    (mapAttrsRecursive (path: type: concatStringsSep "/" path) (getDir dir));

  isNix = hasSuffix ".nix";

  findNixFiles = dir:
    let
      allFiles = dirFiles dir;
      nixFiles = filter isNix allFiles;
      formatter = file: "${dir}/${file}";
    in map formatter nixFiles;

  isTestSuite = fun:
    let args = functionArgs fun;
        takesPkgs = hasAttrByPath ["pkgs"] args;
        takesNixt = hasAttrByPath ["nixt"] args;
    in takesPkgs && takesNixt;
}
