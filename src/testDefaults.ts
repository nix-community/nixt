import { schemaVer } from "./types.js";

export const defaultArgs = {
  paths: [],
  watch: false,
  verbose: false,
  showTrace: false,
  list: false,
  recurse: true,
  debug: false,
};

export const defaultRegistry = {
  __schema: schemaVer,
  settings: {
    list: false,
    watch: false,
    verbose: false,
    trace: false,
  },
  testSpec: [
    {
      path: "./dummy.nix",
      suites: [
        {
          name: "Dummy",
          cases: [
            {
              name: "is a dummy suite",
              expressions: [true],
            },
          ],
        },
      ],
    },
  ],
};
