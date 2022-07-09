import { resolve } from "path";
import { nixEval } from "../runNix";


export function getTestCase(filePath: string, suiteName: string, caseName: string, traceOpt: boolean) {
  return nixEval("get-testcase.nix", {
    trace: traceOpt,
    args: {
      path: resolve(filePath),
      suite: suiteName,
      case: caseName,
    }
  })
}
