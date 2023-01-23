import { injectable } from "inversify";
import { CliArgs, TestFile } from "./types.js";

@injectable()
export abstract class IApp {
  abstract run(args: CliArgs): Promise<void>;
}

@injectable()
export abstract class IArgParser {
  abstract run(): CliArgs;
}

@injectable()
export abstract class TestService {
  abstract run(args: CliArgs): Promise<TestFile[]>;
}

@injectable()
export abstract class INixService {
  abstract run(target: string, trace: boolean, args?: {}): any;
}

@injectable()
export abstract class IRenderService {
  abstract run(args: CliArgs, testFiles: TestFile[]): void;
}
