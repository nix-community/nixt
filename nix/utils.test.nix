{ pkgs ? import <nixpkgs> { }, nixt }:

with pkgs.lib;

let
  # the module we're testing
  utils = pkgs.callPackage ./utils.nix { };

  # file evaluates to an attrset of test suites
in nixt.mkSuites {
  # each suite is top-level attr
  "getDir" = {
    # each case is an attr on the suite
    "empty list for non-existent path" =
      # which must evaluate to true or false
      utils.getDir "/aosfijweeo" == [ ];
    "non-empty list for existing path" = length (attrNames (utils.getDir ./.))
      != 0;
  };

  "dirFiles" = {
    "empty list for non-existent path" = utils.dirFiles "/aosfijweeo" == [ ];
    "non-empty list for existing path" = length (utils.dirFiles ./.) != 0;
  };

  "isNix" = {
    "true for nix files" = utils.isNix "./nixpkgs.nix" == true;
    "false for non-nix files" = utils.isNix "./utils.foo" == false;
  };

  "findNixFiles" = let files = utils.findNixFiles ./.;
  in {
    "empty list for non-existent path" = utils.findNixFiles "/aosfijweeo"
      == [ ];
    "non-empty list for existing path" =
      filter (hasSuffix "utils.test.nix") files != [ ];
  };

  "isTestSuite" = let
    realTest = import ./utils.test.nix;
    nonTest = import ./utils.nix;
  in {
    "true for test suites" = utils.isTestSuite realTest == true;
    "false for non-test suites" = utils.isTestSuite nonTest == false;
  };
}
