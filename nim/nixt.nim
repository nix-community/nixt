{.define(shellNoDebugOutput).}

import json;
import os;
import osproc;
import strformat;
import strutils;
import sequtils;
import tables;
import terminal;

import argparse;
import shell;

import utils;
import nix;
import colorize
import discovery;
import running;

proc tests(num: int): string =
  if num == 1:
    "test"
  else:
    "tests"

let p = newParser("nixt"):
  help "Run Nixlang unit-tests"
  arg "path", help="Path of source and tests", default="."
  flag "-d", "--debug", help="Print debug information"
  flag "-v", "--verbose", help="Print extra information", multiple=true
  flag "-l", "--list", help="List discovered test suites"
  run:
    if opts.list:
      listSpecs(opts.path, opts.verbose, opts.debug)
    else:
      let suites = runSuites(opts.path, opts.verbose, opts.debug)
      var errors = 0
      var cases = 0
      echo fmt"Found {suites.len} test suites"
      for suite in suites:
        for testCase in suite.cases:
          cases += 1
          if not testCase.passed:
            errors += 1
        echo suite, opts.verbose
      let passed = cases - errors
      if errors == 0:
        echo ""
        echo fmt"""🎉 {cases} {tests(cases)} {"PASSED"|green} 🎉"""
      elif errors == cases:
        echo ""
        echo fmt"""⚠ {errors} {tests(cases)} {"FAILED"|red} ⚠"""
      else:
        echo ""
        echo fmt"""⚠ {passed} {tests(passed)} {"PASSED"|yellow} but {errors} {tests(errors)} {"FAILED"|red} ⚠"""

p.run commandLineParams()
