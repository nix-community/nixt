export type CliArgs = {
    standalone: boolean;
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
