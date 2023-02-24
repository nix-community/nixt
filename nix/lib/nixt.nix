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
    testSpec = list Block;
  };

  Settings = struct "Settings" {
    list = bool;
    watch = bool;
    verbose = bool;
    trace = bool;
  };

  Block = struct "Block" {
    path = path;
    suites = list TestSuite;
  };

  TestSuite = struct "TestSuite" {
    name = string;
    cases = list TestCase;
  };

  TestCase = struct "TestCase" {
    name = string;
    expressions = list bool;
  };
in {
  # Build the nixt schema. Should be outputted to __nixt for CLI consumption.
  grow =
    defun [
      (struct {
        blocks = list Block;
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

  # Generates test blocks
  block = let
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

    # Prepares test suites for block consumption
    describe =
      defun [string (attrs (either bool (list bool))) TestSuite]
      (
        name: cases:
          TestSuite {
            inherit name;
            cases = lib.mapAttrsToList (caseName: expressions: it caseName expressions) cases;
          }
      );
  in
    defun [path (attrs (attrs (either bool (list bool)))) Block]
    (
      path: suites:
        Block {
          inherit path;
          suites = lib.mapAttrsToList (name: cases: describe name cases) suites;
        }
    );

  # Enables support for the "standalone" style which uses
  # {nixt, pkgs ? import <nixpkgs> {}}: functions as seen in non-flake projects.
  inject = path: import path {nixt = cell.nixt;};
}
