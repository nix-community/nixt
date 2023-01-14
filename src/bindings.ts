import { AsyncContainerModule, interfaces } from "inversify";

export * from "./App.js";
export * from "./components/index.js";

import {
    IArgParser,
    INixService,
    IRenderService,
    ITestFinder,
    ITestRunner,
} from "./interfaces.js";
import {
    ArgParser,
    NixService,
    RenderService,
    TestFinder,
    TestRunner,
} from "./components/index.js";

export const bindings = new AsyncContainerModule(async (bind: interfaces.Bind) => {
    bind(IArgParser).to(ArgParser);
    bind(ITestFinder).to(TestFinder);
    bind(ITestRunner).to(TestRunner);
    bind(IRenderService).to(RenderService);
    bind(INixService).to(NixService);
});
