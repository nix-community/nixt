import { AsyncContainerModule, interfaces } from 'inversify';

import { IApp, IArgParser, ITestFinder, ITestRenderer, ITestRunner, ITestService } from './interfaces';
import { App, ArgParser, TestFinder, TestRenderer, TestRunner, TestService } from './services';

export const bindings = new AsyncContainerModule(
    async (bind: interfaces.Bind) => {
        bind(IApp).to(App);
        bind(IArgParser).to(ArgParser);
        bind(ITestFinder).to(TestFinder);
        bind(ITestRunner).to(TestRunner);
        bind(ITestRenderer).to(TestRenderer);
        bind(ITestService).to(TestService);
    }
)
