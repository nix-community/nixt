import { injectable } from "inversify";
import { CliArgs, NixOptions, TestFile } from "./types.js";

@injectable()
export abstract class IApp {
    abstract run(args: CliArgs): void;
    abstract initializing(args: CliArgs): void;
    abstract running(args: CliArgs, spec: TestFile[]): void;
    abstract watching(args: CliArgs, spec: TestFile[]): void;
    abstract testing(args: CliArgs, spec: TestFile[]): void;
    abstract reporting(args: CliArgs, spec: TestFile[]): void;
}

@injectable()
export abstract class IArgParser {
    abstract run(): CliArgs;
}

@injectable()
export abstract class ITestFinder {
    abstract run(args: CliArgs): Promise<TestFile[]>;
}

@injectable()
export abstract class ITestRunner {
    abstract run(args: CliArgs, testFiles: TestFile[]): Promise<TestFile[]>;
}

@injectable()
export abstract class INixService {
    abstract eval(path: string, options: NixOptions): any;
}

@injectable()
export abstract class IRenderService {
    abstract run(args: CliArgs, testFiles: TestFile[]): void;
}
