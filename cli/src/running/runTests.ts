import { TestFile } from "../discovery/types";
import { getTestCase } from "../nix";


export function runTests(testFiles: TestFile[]) {
  for (const testFile of testFiles) {
    for (const [suiteName, testSuite] of Object.entries(testFile.suites)) {
      for (const [caseName, testCase] of Object.entries(testSuite.cases)) {
        try {
          testCase.result = getTestCase(testFile.path, suiteName, caseName);
        } catch (e: any) {
          testCase.error = e.message;
        }
      }
    }
  }
}