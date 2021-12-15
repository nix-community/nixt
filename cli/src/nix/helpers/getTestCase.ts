import { resolve } from "path";
import { nixEval } from "../runNix";


export function getTestCase(filePath: string, suiteName: string, caseName: string) {
  return nixEval("get-testcase.nix", {
    args: {
      path: resolve(filePath),
      suite: suiteName,
      case: caseName,
    }
  })
}