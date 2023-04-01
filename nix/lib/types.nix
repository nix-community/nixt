{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs std;
  lib = nixpkgs.lib // builtins;

  inherit (std.inputs.yants) string bool path attrs list struct defun either option;
in rec {
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
}
