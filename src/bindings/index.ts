import { AsyncContainerModule, interfaces } from 'inversify';

import { NixtApp } from '../app';
import { ArgParser } from '../args';
import { IArgParser, INixtApp } from '../interfaces';

export const bindings = new AsyncContainerModule(
    async (bind: interfaces.Bind) => {
        bind(INixtApp).to(NixtApp);
        bind(IArgParser).to(ArgParser);
    }
)
