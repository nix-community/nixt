{
  pkgs ? import <nixpkgs> {},
  path,
}:
with pkgs.lib;
  import path {
    nixt = {
      mkSuite = name: cases: {
        inherit path;
        suites = {"${name}" = mapAttrsToList (k: v: k) cases;};
      };

      mkSuites = suites: {
        inherit path;
        suites =
          mapAttrs
          (suiteName: suite: mapAttrsToList (caseName: case: caseName) suite)
          suites;
      };
    };
  }
