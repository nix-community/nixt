{ pkgs ? import <nixpkgs> {} }:

with builtins;
with pkgs.lib;

let
  fetchNimblePackage = { owner, repo, rev, sha256, path ? ""}@args:
    let
      fetchArgs = removeAttrs args ["path"];
      package = pkgs.fetchFromGitHub fetchArgs;
      optionalPath = optionalString (path != "") "/${path}";
    in "${package}" + optionalPath;
in {
  argparse = fetchNimblePackage {
    owner = "iffy";
    repo = "nim-argparse";
    rev = "4c890c088c8370acd835689b85fb6a19bcd2007e";
    sha256 = "1k4dkqsqsmbak1acz5miici7y2am2r9qf8qq2qi1qjknk2g5ybkv";
    path = "src";
  };

  shell = fetchNimblePackage {
    owner = "Vindaar";
    repo = "shell";
    rev = "4bc09cfdbd4f2b3c04a09cf5a92f8605cb9b3782";
    sha256 = "1qy2sqck8bmdzp6hkq9ayddwc0zk3jkrnj08kszdfs2wcifp5r0w";
  };
}
