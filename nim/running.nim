import tables
import terminal
import strformat
import json

import nix
import discovery
import colorize


type
  Case* = object
    name*: string
    passed*: bool
    output*: string

  Suite* = object
    file*: string
    name*: string
    cases*: Cases

  Cases* = seq[Case]
  Suites* = seq[Suite]

func passedLabel(testCase: Case): string =
  if testCase.passed: "✔"|green else: "✗"|red

proc echo(testCase: Case, verbose: int = 0) =
  echo fmt"-- {passedLabel(testCase)} {testCase.name}"
  if verbose > 0 and not testCase.passed:
    echo testCase.output

proc echo*(suite: Suite, verbose: int = 0) =
  echo fmt"> {suite.name|blue} ({suite.file})"
  for testCase in suite.cases:
    echo testCase, verbose

proc runSuites*(path: string, verbose: int = 0, debug: bool = false): Suites =
  var suites: Suites
  let (specs, errors) = findTestSpecs(path)
  for spec in specs:
    var cases: Cases
    for caseName in spec.cases:
      var testCase: Case
      testCase.name = caseName
      try:
        let jResult = nix("get-case",
                          strict=true,
                          verbose=verbose,
                          debug=debug,
                          args=[
                            fmt"""path="{spec.file}"""",
                            fmt"""case="{testCase.name}"""",
                          ])
        testCase.output = ""
        testCase.passed = to(jResult, bool)
      except NixError as e:
        testCase.passed = false
        testCase.output = e.msg
      cases.add(testCase)
    let suite = Suite(file: spec.file, name: spec.name, cases: cases)
    suites.add(suite)
  return suites
