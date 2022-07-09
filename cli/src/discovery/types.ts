export class TestCase {
  name: string;
  result?: boolean;
  error?: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class TestSuite {
  name: string;
  cases: Record<string, TestCase>;

  constructor(name: string) {
    this.name = name;
    this.cases = {};
  }
}

export class TestFile {
  path: string;
  suites: Record<string, TestSuite>;
  importError?: string;

  constructor(path: string) {
    this.path = path;
    this.suites = {};
  }
}