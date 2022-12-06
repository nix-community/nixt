{pkgs ? import <nixpkgs> {}}:
with builtins;
with pkgs.lib; rec {
  isFile = file: type:
    if type == "directory"
    then getDir "${dir}/${file}"
    else type;

  getDir = dir:
    if pathExists dir && pathIsDirectory dir
    then mapAttrs isFile (readDir dir)
    else [];

  dirFiles = dir:
    if pathExists dir && pathIsDirectory dir
    then
      collect isString
      (mapAttrsRecursive (path: type: concatStringsSep "/" path) (getDir dir))
    else [];

  isNix = hasSuffix ".nix";

  findNixFiles = path: let
    isDir = pathIsDirectory path;
    allFiles =
      if isDir
      then dirFiles path
      else [path];
    nixFiles = filter isNix allFiles;
    formatter =
      if isDir
      then file: "${path}/${file}"
      else file: path;
  in
    map formatter nixFiles;

  isTestSuite = fun: let
    args = functionArgs fun;
    takesPkgs = hasAttrByPath ["pkgs"] args;
    takesNixt = hasAttrByPath ["nixt"] args;
  in
    takesPkgs && takesNixt;
}
