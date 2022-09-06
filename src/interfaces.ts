import { injectable } from 'inversify';
import { CliArgs, NixOptions, Path, TestFile } from './types';

@injectable()
export abstract class IApp {
    abstract run(): void;
}

@injectable()
export abstract class IArgParser {
    abstract run(): CliArgs;
}

@injectable()
export abstract class ITestFinder {
    abstract getFiles(args: CliArgs, path: Path): Path[];
    abstract run(args: CliArgs): TestFile[];
}

@injectable()
export abstract class ITestRunner {
    abstract run(args: CliArgs, testFiles: TestFile[]): void;
}

@injectable()
export abstract class ITestRenderer {
    abstract result(args: CliArgs, testFiles: TestFile[]): void;
    abstract list(args: CliArgs, testFiles: TestFile[]): void;
}

@injectable()
export abstract class ITestService {
    abstract run(args: CliArgs): void;
}

@injectable()
export abstract class INixService {
    abstract eval(path: Path, options: NixOptions): any;
}
