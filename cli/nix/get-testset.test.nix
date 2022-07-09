{ pkgs ? import <nixpkgs> {}, nixt }:

with nixt;

let
    utils = pkgs.callPackage ./utils {};
in mkSuites {
    "mkSuite" =
        let
            testSet = mkSuite "foo" { bar = true; };
        in {
            "creates correct structure" =
                testSet == {
                    path = testSet.path;
                    suites = {
                        foo = {
                            bar = true;
                        };
                    };
                };
        };

    "mkSuites" =
        let testSet = mkSuites {
            "foo" = { faz = true; };
            "bar" = { baz = true; };
        };
        in {
            "creates correct structure" =
                testSet == {
                    path = testSet.path;
                    suites = {
                        foo = {
                            faz = true;
                        };
                        bar = {
                            baz = true;
                        };
                    };
            };
            "always fails" = false;
        };
}