{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs std;
  lib = nixpkgs.lib // builtins;

  inherit (std.inputs.yants) string bool path attrs list struct defun either option;
  inherit (cell.types) Schema Settings Block TestSuite TestCase;
in rec {
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
  block =
    defun [path (list TestSuite) Block]
    (
      path: suites: Block {inherit path suites;}
    );

  block' =
    defun [path (attrs (attrs (either bool (list bool)))) Block]
    (
      path: suites: block path (lib.mapAttrsToList (name: cases: describe' name cases) suites)
    );

  # Prepares test suites for block consumption
  describe =
    defun [string (list TestCase) TestSuite]
    (
      name: cases: TestSuite {inherit name cases;}
    );

  describe' =
    defun [string (attrs (either bool (list bool))) TestSuite]
    (
      name: cases: describe name (lib.mapAttrsToList (caseName: expressions: it caseName expressions) cases)
    );

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

  # Enables support for the "standalone" style which uses
  # {nixt, pkgs ? import <nixpkgs> {}}: functions as seen in non-flake projects.
  inject = path: import path {nixt = cell.nixt;};
}
