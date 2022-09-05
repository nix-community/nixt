import { injectable } from 'inversify';

@injectable()
export abstract class INixtApp {
    abstract run(): void;
}
