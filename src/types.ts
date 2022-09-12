export type Path = string;

export type CliArgs = {
    paths: Path[];
    watch: boolean;
    verbose: boolean[];
    list: boolean;
    recurse: boolean;
    debug: boolean;
    help: boolean;
}

export type NixOptions = {
    attr?: string;
    strict?: boolean;
    trace?: boolean;
    debug?: boolean;
    args?: {};
}

export type TestSpec = {
    path: Path;
    suites: {
        [key: string]: string[];
    };
}

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
    path: Path;
    suites: Record<string, TestSuite>;
    importError?: string;

    constructor(path: Path) {
        this.path = path;
        this.suites = {};
    }
}
