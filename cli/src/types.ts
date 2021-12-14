
export type TestSet = {
  path: string;
  suites: {
    [key: string]: {
      [key: string]: boolean;
    };
  }
}

export type TestSpec = {
  path: string;
  suites: {
    [key: string]: string[];
  };
}

export type TestData = TestSet | TestSpec;

export type TestResult<T extends TestData> = {
  results: T[],
  importFailures: { file: string, error: Error }[],
}

export type TestRunner<T extends TestData> = (path: string) => T;