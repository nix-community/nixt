import { getTestCase } from "../nix";
import { TestFile } from "../types";

export function runTests(testFiles: TestFile[], traceOpt: boolean) {
  for (const testFile of testFiles) {
    for (const [suiteName, testSuite] of Object.entries(testFile.suites)) {
      for (const [caseName, testCase] of Object.entries(testSuite.cases)) {
        try {
          testCase.result = getTestCase(testFile.path, suiteName, caseName, traceOpt);
        } catch (e: any) {
          testCase.error = e.message;
        }
      }
    }
  }
}
