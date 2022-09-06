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
    abstract run(path: CliArgs["path"]): TestFiles;
}

@injectable()
export abstract class ITestRunner {
    abstract run(testFiles: TestFiles): void;
}

@injectable()
export abstract class ITestRenderer {
    abstract result(testFiles: TestFiles): void;
    abstract list(testFiles: TestFiles): void;
}

@injectable()
export abstract class ITestService {
    abstract run(listArg: CliArgs["list"], verboseArg: CliArgs["verbose"]): void;
}
