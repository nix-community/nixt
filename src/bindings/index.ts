import { AsyncContainerModule, interfaces } from 'inversify';

import { NixtApp } from '../app';
import { ArgParser } from '../args';
import { IArgParser, INixtApp, ITestFinder, ITestRenderer, ITestRunner, ITestService } from '../interfaces';
import { TestFinder, TestRenderer, TestRunner, TestService } from '../services';

export const bindings = new AsyncContainerModule(
    async (bind: interfaces.Bind) => {
        bind(INixtApp).to(NixtApp);
        bind(IArgParser).to(ArgParser);
        bind(ITestFinder).to(TestFinder);
        bind(ITestRunner).to(TestRunner);
        bind(ITestRenderer).to(TestRenderer);
        bind(ITestService).to(TestService);
    }
)
