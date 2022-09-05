import { AsyncContainerModule, interfaces } from 'inversify';

import { NixtApp } from '../app';
import { INixtApp } from '../interfaces';

export const bindings = new AsyncContainerModule(
    async (bind: interfaces.Bind) => {
        bind(INixtApp).to(NixtApp);
    }
)
