import { z } from "zod";

export const testCase = z.object({
  name: z.string(),
  expressions: z.boolean().array(),
  error: z.string().optional(),
});

export type TestCase = z.infer<typeof testCase>;

export const testSuite = z.object({
  name: z.string(),
  cases: testCase.array(),
});

export type TestSuite = z.infer<typeof testSuite>;

export const testFile = z.object({
  path: z.string(),
  suites: testSuite.array(),
  importError: z.string().optional(),
});

export type TestFile = z.infer<typeof testFile>;

export const schemaVer = "v0.0";
export const schema = z
  .object({
    __schema: z.string(),
    settings: z.object({
      list: z.boolean(),
      watch: z.boolean(),
      verbose: z.boolean(),
      trace: z.boolean(),
    }),
    testSpec: testFile.array(),
  })
  .required();

export type Schema = z.infer<typeof schema>;

export type CliArgs = {
  paths: string[];
  watch: boolean;
  verbose: boolean;
  showTrace: boolean;
  list: boolean;
  recurse: boolean;
  debug: boolean;
};

export type TOptions = {
  watch: boolean;
  verbose: boolean;
  showTrace: boolean;
  list: boolean;
  recurse: boolean;
  debug: boolean;
};
