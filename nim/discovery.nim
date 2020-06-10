import os
import json
import sequtils
import strutils
import strformat
import terminal

import nix
import utils
import colorize

type
  SuiteSpec* = object
    file*: string
    name*: string
    cases*: seq[string]

  ImportFailure* = object
    file*: string
    output*: string

  SuiteSpecs* = seq[SuiteSpec]
  ImportFailures* = seq[ImportFailure]
  Discovery = tuple [specs: SuiteSpecs, errors: ImportFailures]

proc echo*(suite: SuiteSpec) =
  let
    name = suite.name|blue
    count = $suite.cases.len|blue
    cases = suite.cases.join ", "
  echo fmt"""Found suite "{name}" with {count} cases in {suite.file}"""
  echo fmt"=> {cases}"

proc echo*(discovery: Discovery, verbose: int = 0) =
  let (specs, errors) = discovery
  let nErrors = errors.len
  for spec in specs:
    echo spec
  if verbose > 0 and nErrors > 0:
    echo fmt"""{errors.len} files {"failed to import"|red}:"""
    for error in errors:
      echo fmt"""{">"|red} {error.file}"""
      echo error.output

proc findTestSpecs*(path: string, verbose: int = 0, debug: bool = false): Discovery =
  var specs: SuiteSpecs
  var failedImports: ImportFailures

  for file in findNixFiles(path):
    try:
      let jSpec = nix("get-spec",
                      strict=true,
                      verbose=verbose,
                      debug=debug,
                      args=[fmt"""path="{file}""""])
      jSpec["file"] = newJString(file)
      let spec = to(jSpec, SuiteSpec)
      specs.add(spec)
    except NixError as e:
      failedImports.add(ImportFailure(file: file, output: e.msg))
  return (specs, failedImports)

proc listSpecs*(path: string, verbose: int = 0, debug: bool = false) =
  let discovery = findTestSpecs(path, verbose, debug)
  echo(discovery, verbose)
