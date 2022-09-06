import { injectable } from "inversify";
import { ITestRenderer } from "../interfaces";
import { TestFiles } from "../types";

@injectable()
export class TestRenderer implements ITestRenderer {
    result(testFiles: TestFiles): void {
        console.log("TestRenderer.result() was called!")
        return
    }

    list(testFiles: TestFiles): void {
        console.log("TestRenderer.list() was called")
        return
    }
}
