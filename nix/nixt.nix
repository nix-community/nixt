{ 
  pkgs ? import <nixpkgs> {},
  args ? "",
  utils ? import ./utils.nix,
  get-spec ? import ./get-spec.nix }:
let 
  util = utils { inherit pkgs; };
  src = builtins.path { path = args;};
  nixFiles = util.findNixFiles src;
  importedNixFiles = with builtins; map (p: path { path = p; }) nixFiles;
  testPaths = with builtins; filter (p: util.isTestSuite (import p)) nixFiles;
in {
  tests = builtins.map (path: get-spec { inherit pkgs path; }) testPaths;
  src=args;
}
