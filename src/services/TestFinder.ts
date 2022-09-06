import { injectable } from "inversify";
import { ITestFinder } from "../interfaces";
import { Path } from "../types";

@injectable()
export class TestFinder implements ITestFinder {
    run(path: Path) {
        return [];
    }
}
