import { injectable } from "inversify";
import { ITestRunner } from "../interfaces";

@injectable()
export class TestRunner implements ITestRunner {
    run(): void {
        return
    }
}
