import { getTestSpec } from "../nix";
import { dirFiles } from "./dirFiles";

import { TestCase, TestFile, TestSuite } from "../types";

export function findTests(path: string): TestFile[] {
  const files =
    dirFiles(path, true)
      .filter(p => p.endsWith(".test.nix") || p.endsWith(".spec.nix") || p.endsWith(".nixt"))

  const testFiles: TestFile[] = [];

  for (const file of files) {
    const testFile = new TestFile(file);

    try {
      const { suites } = getTestSpec(file);
      for (const [suiteName, cases] of Object.entries(suites)) {
        const testSuite = new TestSuite(suiteName);
        for (const caseName of cases) {
          const testCase = new TestCase(caseName);
          testSuite.cases[caseName] = testCase;
        }
        testFile.suites[suiteName] = testSuite;
      }
    } catch (e: any) {
      testFile.importError = e.message;
    }
    testFiles.push(testFile);
  }

  return testFiles;
}
