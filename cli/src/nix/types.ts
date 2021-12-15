
export type NixOptions = {
  attr?: string;
  strict?: boolean;
  verbose?: number;
  debug?: boolean;
  args?: {};
}

export type TestSpec = {
  path: string;
  suites: {
    [key: string]: string[];
  };
}

