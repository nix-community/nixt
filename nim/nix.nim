import os
import osproc
import json
import strformat
import strutils


type
  NixError* = object of Exception

var nixt* = getEnv "NIXT"

proc getArgArgs(args: varargs[string]): string =
  result = ""
  for arg in args:
    let parts = arg.split("=")
    if parts.len == 2:
      result &= fmt"--arg {parts[0]} '{parts[1]}' "

proc nix*(
  function: string,
  attr: string = "",
  strict: bool = false,
  verbose: int = 0,
  debug: bool = false,
  args: varargs[string]): JsonNode =
  let
    argArgs = getArgArgs(args)
    verboseArg = if verbose > 1: "--show-trace" else: ""
    strictArg = if strict: "--strict" else: ""
    attrArg = if attr != "": "-A {attr}" else: ""
    baseArgs = fmt"{strictArg} {verboseArg} --eval --json {attrArg}"
    pkgsArg = "--arg pkgs 'import <nixpkgs> {}'"
    cmd = fmt"nix-instantiate {baseArgs} {pkgsArg} {argArgs} {nixt}/{function}.nix"
  let (res, err) = execCmdEx cmd
  if debug:
    echo fmt"Nix command: {cmd}"
    echo "---"
    echo res
    echo ""
  if err == 0:
    return res.parseJson()
  else:
    raise newException(NixError, res)
