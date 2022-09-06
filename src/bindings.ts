import { AsyncContainerModule, interfaces } from 'inversify';

import { IApp, IArgParser, INixService, ITestFinder, ITestRenderer, ITestRunner, ITestService } from './interfaces';
import { App, ArgParser, NixService, TestFinder, TestRenderer, TestRunner, TestService } from './services';

export const bindings = new AsyncContainerModule(
    async (bind: interfaces.Bind) => {
        bind(IArgParser).to(ArgParser);
        bind(ITestFinder).to(TestFinder);
        bind(ITestRunner).to(TestRunner);
        bind(ITestRenderer).to(TestRenderer);
        bind(ITestService).to(TestService);
        bind(INixService).to(NixService);
        bind(IApp).to(App);
    }
)
