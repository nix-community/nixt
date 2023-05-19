#!/usr/bin/env node

import "reflect-metadata";

import React from "react";

import { render } from "ink";
import { Container } from "inversify";
import { bindings } from "./bindings.js";
import { IApp } from "./interfaces.js";
import { Command } from "@commander-js/extra-typings";
import { CliArgs } from "./types.js";
import { Run, Watch } from "./ink/index.js";

const container = new Container();
container.load(bindings);

const nixt = new Command("nixt");

nixt.command("run", { isDefault: true, hidden: true })
  .argument("[paths...]", "paths to search for tests")
  .option("-w, --watch", "watch for changes", false)
  .option("-v, --verbose", "show passing tests", false)
  .option("--show-trace", "pass '--show-trace` to nix commands", false)
  .option("-l, --list", "list tests", false)
  .option("--no-recurse", "don't recurse directories")
  .option("-d, --debug", "show debug info", false)
  .action((paths, options) => {
    const app = container.get(IApp);
    const args: CliArgs = { paths, ...options };
    app.run(args);
  });

nixt.command("ink-run", { hidden: true })
  .argument("[paths...]", "paths to search for tests")
  .option("-w, --watch", "watch for changes", false)
  .option("-v, --verbose", "show passing tests", false)
  .option("--show-trace", "pass '--show-trace` to nix commands", false)
  .option("-l, --list", "list tests", false)
  .option("--no-recurse", "don't recurse directories")
  .option("-d, --debug", "show debug info", false)
  .action((paths, options) => {
    const args: CliArgs = { paths, ...options };
    render(<Run {...args} />);
  });

nixt.command("ink-watch", { hidden: true })
  .argument("[paths...]", "paths to search for tests")
  .option("-w, --watch", "watch for changes", false)
  .option("-v, --verbose", "show passing tests", false)
  .option("--show-trace", "pass '--show-trace` to nix commands", false)
  .option("-l, --list", "list tests", false)
  .option("--no-recurse", "don't recurse directories")
  .option("-d, --debug", "show debug info", false)
  .action((paths, options) => {
    const args: CliArgs = { paths, ...options };
    render(<Watch {...args} />);
  });

nixt.parse();
