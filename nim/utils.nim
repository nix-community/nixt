import os
import sequtils
import strutils

proc findNixFiles*(path: string): seq[string] =
  result = newSeq[string]()
  for x in walkDir(path):
    if x.kind == pcDir:
      result = concat(result, findNixFiles(x.path))
    elif x.path.endsWith ".nix":
      result.add(x.path)

proc commonPrefix*(paths: openArray[string], sep = "/"): string =
  if len(paths) == 0:
    return ""
  let first = paths[0]
  var index = -1
  block loop:
    for i in 0 ..< len(first):
      for j in 1 .. paths.high():
        let path = paths[j]
        if i < len(path) and first[i] != path[i]:
          break loop
      index = i
  if index == -1:
    return ""
  else:
    return first[0 .. first.rfind(sep, 0, index)]
