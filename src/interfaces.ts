import { injectable } from 'inversify';
import { CliArgs, TestFiles } from './types';

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
    abstract run(args: CliArgs): TestFiles;
}

@injectable()
export abstract class ITestRunner {
    abstract run(args: CliArgs, testFiles: TestFiles): void;
}

@injectable()
export abstract class ITestRenderer {
    abstract result(args: CliArgs, testFiles: TestFiles): void;
    abstract list(args: CliArgs, testFiles: TestFiles): void;
}

@injectable()
export abstract class ITestService {
    abstract run(args: CliArgs): void;
}
