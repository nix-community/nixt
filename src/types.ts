import { z } from "zod";

export const testCase = z.object({
    name: z.string(),
    expressions: z.boolean().array(),
});

export const testSuite = z.object({
    name: z.string(),
    cases: testCase.array(),
});

export const testFile = z.object({
    path: z.string(),
    suites: testSuite.array(),
});

export const schema = z.object({
    __schema: z.string(),
    settings: z.object({
        list: z.boolean(),
        watch: z.boolean(),
        verbose: z.boolean(),
        trace: z.boolean()
    }),
    testSpec: testFile.array(),
}).required();

export type Schema = z.infer<typeof schema>;

export type CliArgs = {
    paths: string[];
    watch: boolean;
    verbose: boolean[];
    list: boolean;
    recurse: boolean;
    debug: boolean;
    help: boolean;
};

export type NixOptions = {
    attr?: string;
    strict?: boolean;
    trace: boolean;
    debug?: boolean;
    args?: {};
};

export type TestSpec = {
    path: string;
    suites: {
        [key: string]: string[];
    };
};

export class TestFile {
    path: string;
    suites: TestSuite[];
    importError?: string;

    constructor(path: string) {
        this.path = path;
        this.suites = [];
    }
}

export class TestSuite {
    name: string;
    cases: TestCase[];

    constructor(name: string) {
        this.name = name;
        this.cases = [];
    }
}

export class TestCase {
    name: string;
    result?: boolean;
    error?: string;

    constructor(name: string) {
        this.name = name;
    }
}
