
export type NixOptions = {
  attr?: string;
  strict?: boolean;
  trace?: boolean;
  debug?: boolean;
  args?: {};
}

export type TestSpec = {
  path: string;
  suites: {
    [key: string]: string[];
  };
}

