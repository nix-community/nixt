#!/usr/bin/env node

import "reflect-metadata";

import { Container } from "inversify";
import { IApp, IArgParser } from "./interfaces.js";
import { bindings } from "./bindings.js";

async function init() {
    const container = new Container();
    container.loadAsync(bindings);
    const argParser = container.get(IArgParser);
    const app = container.get(IApp);

    app.run(argParser.run());
}

init();
