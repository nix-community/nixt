import { resolve } from "path";
import { nixEval } from "../runNix";
import { TestSpec } from "../types";


export function getTestSpec(filePath: string): TestSpec {
  return nixEval("get-testspec.nix", {
    args: {
      path: resolve(filePath),
    }
  })
}