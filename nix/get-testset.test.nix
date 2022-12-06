{
  pkgs ? import <nixpkgs> {},
  nixt,
}: let
  utils = pkgs.callPackage ./utils {};
in
  nixt.mkSuites {
    "mkSuite" = let
      testSet = nixt.mkSuite "foo" {bar = true;};
    in {
      "creates correct structure" =
        testSet
        == {
          path = testSet.path;
          suites = {foo = {bar = true;};};
        };
    };

    "mkSuites" = let
      testSet = nixt.mkSuites {
        "foo" = {faz = true;};
        "bar" = {baz = true;};
      };
    in {
      "creates correct structure" =
        testSet
        == {
          path = testSet.path;
          suites = {
            foo = {faz = true;};
            bar = {baz = true;};
          };
        };
    };
  }
