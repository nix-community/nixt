#!/usr/bin/env node

import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "./bindings.js";
import { IApp, IArgParser } from "./interfaces.js";
import { CliArgs } from "./types.js";

// Prepare DI
const container = new Container();
container.load(bindings);

// Get args
const argParser = container.get(IArgParser);
let args: CliArgs = argParser.run();

// Prepare to run
const app = container.get(IApp);

// Run
app.run(args);
