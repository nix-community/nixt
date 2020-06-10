import strutils;
import strformat;

import terminal;

func colorize*(s: string, color: ForegroundColor): string =
  let
    code = ansiForegroundColorCode(color)
    default = ansiForegroundColorCode(fgDefault)
  return fmt"{code}{s}{default}"

template `|`* (s: string, c: untyped): untyped =
  colorize(s, `fg c`)
