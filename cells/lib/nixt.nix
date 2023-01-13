{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs yants;
  lib = nixpkgs.lib // builtins;

  inherit (yants) string bool path attrs list struct defun either option;

  Schema = struct "Schema" {
    __schema = string;
    settings = Settings;
    testSpec = list TestFile;
  };

  Settings = struct "Settings" {
    list = bool;
    watch = bool;
    verbose = bool;
    trace = bool;
  };

  TestFile = struct "TestFile" {
    path = path;
    suites = Block;
  };

  Block = list TestSuite;

  TestSuite = struct "TestSuite" {
    name = string;
    cases = list TestCase;
  };

  TestCase = struct "TestCase" {
    name = string;
    expressions = list bool;
  };
in {
  ## For use in flake.nix
  # TODO: Consume it.
  # Build the nixt schema. Should be outputted to __nixt for CLI consumption.
  grow =
    defun [
      (struct {
        blocks = either TestFile (list TestFile);
        settings = option Settings;
      })
      Schema
    ]
    (
      {
        blocks,
        settings ? {
          list = false;
          watch = false;
          verbose = false;
          trace = false;
        },
      }:
        Schema {
          __schema = "v0.0";
          settings = settings;
          testSpec = blocks;
        }
    );

  # Prepare blocks for grow consumption
  stack =
    defun [path Block TestFile]
    (
      path: suites:
        TestFile {
          inherit path suites;
        }
    );

  ## This seems superfluous. Just make a list of suites yourself?
  # Designates a nixt block
  block =
    defun [(either TestSuite (list TestSuite)) Block]
    (
      suites:
        if lib.isList suites
        then suites
        else lib.toList suites
    );

  # Designates a test suite
  describe = let
    # Prepares test cases for describe consumption
    it =
      defun [string (either bool (list bool)) TestCase]
      (
        name: expressions:
          TestCase {
            inherit name;
            expressions =
              if lib.isList expressions
              then expressions
              else lib.toList expressions;
          }
      );
  in
    defun [string (attrs (either bool (list bool))) TestSuite]
    (
      name: cases:
        TestSuite {
          inherit name;
          cases = lib.mapAttrsToList (caseName: expressions: it caseName expressions) cases;
        }
    );
}
