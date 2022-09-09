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
    abstract run(args: CliArgs, path: Path): Promise<TestFile[]>;
}

@injectable()
export abstract class ITestRunner {
    abstract run(args: CliArgs, testFiles: TestFile[]): Promise<void>;
}

@injectable()
export abstract class INixService {
    abstract eval(path: Path, options: NixOptions): any;
}

@injectable()
export abstract class IRenderService {
    abstract run(args: CliArgs, testFiles: TestFile[], path: Path): void;
}
