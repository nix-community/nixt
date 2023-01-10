{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs yants;
  lib = nixpkgs // builtins;

  inherit (yants) string bool path list struct defun either option;

  Schema = struct "Schema" {
    __schema = string;
    options = Options;
    testSpec = TestSpec;
  };

  Options = struct {
    list = bool;
    watch = bool;
    verbose = bool;
    trace = bool;
  };

  TestSpec = list struct "TestSpec" {
    files = list TestFile;
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
    assertions = list bool;
  };
in {
  ## For use in flake.nix
  # TODO: Consume it.
  # Build the nixt schema. Should be outputted to __nixt for CLI consumption.
  grow =
    defun [(either TestFile (list TestFile)) (option Options)]
    (
      files: options:
        Schema {
          __schema = "v0";
          options = options;
          testSpec = TestSpec {
            files =
              if lib.isList files
              then files
              else lib.toList files;
          };
        }
    );

  # For use with testing files: block <path> <import>
  # For use with testing blocks: block <path> <import.blockAttr>
  #
  # A testing file is really just a file-sized testing block.
  # Because the block encompasses the entire file, no mkBlock is necessary.
  block =
    defun [path Block]
    (
      path: block:
        TestFile {
          path = path;
          suites = block;
        }
    );

  ## For use in test/source files
  # Designates a nixt block. Unnecessary for separate test files.
  mkBlock =
    defun [(either TestSuite (list TestSuite))]
    (
      suites:
        if lib.isList suites
        then suites
        else lib.toList suites
    );

  # Designates a test suite
  describe =
    defun [string (list TestCase)]
    (
      name: cases:
        TestSuite {
          name = name;
          cases = lib.mapAttrsToList (key: value: key) cases;
        }
    );

  # Designates a test case
  it =
    defun [string (either bool (list bool))]
    (
      name: expressions:
        TestCase {
          name = name;
          assertions =
            if lib.isList expressions
            then expressions
            else lib.toList expressions;
        }
    );
}
