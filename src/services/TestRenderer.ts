import { injectable } from "inversify";
import { ITestRenderer } from "../interfaces";

import { CliArgs, TestFile } from "../types";

@injectable()
export class TestRenderer implements ITestRenderer {
    result(args: CliArgs, testFiles: TestFile[]) {
        console.log("TestRenderer.result() was called!")
        return
    }

    list(args: CliArgs, testFiles: TestFile[]) {
        console.log("TestRenderer.list() was called")
        return
    }
}
