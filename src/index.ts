#!/usr/bin/env node

import "reflect-metadata";

import { Container } from "inversify";
import { IApp, IArgParser } from "./interfaces.js";
import { bindings } from "./bindings.js";
import { CliArgs } from "./types.js";
import { buildProviderModule } from "inversify-binding-decorators";

// Prepare DI
const container = new Container();
container.loadAsync(bindings);
container.load(buildProviderModule())

// Get args
const argParser = container.get(IArgParser);
let args: CliArgs = argParser.run();

// Prepare to run
const app = container.get(IApp);

// Run
app.run(args);
