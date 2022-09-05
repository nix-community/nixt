import { injectable } from 'inversify';

@injectable()
export abstract class INixtApp {
    abstract run(): void;
}

export abstract class ICliArgs {
    path: string;
    watch: boolean;
    verbose: boolean[];
    list: boolean;
    debug: boolean;
    help: boolean;
}

@injectable()
export abstract class IArgParser {
    abstract run(): ICliArgs
}
