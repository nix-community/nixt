import React from "react";

import { render } from "ink-testing-library";
import { defaultArgs } from "../testDefaults.js";
import { CliArgs } from "../types.js";
import { Watch } from "./Watch.js";

describe("Ink Watch", () => {
  const Sut = Watch;
  let args: CliArgs;

  beforeEach(() => {
    args = { ...defaultArgs };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is defined", () => {
    expect(Sut).toBeDefined();
  });

  it("renders expected default frame", () => {
    const sut = render(<Sut {...args} />);

    expect(sut.lastFrame()).toMatchSnapshot();
  });

  it.todo("runs in flake mode when no path is given", () => {
    args.paths = [];

    render(<Sut {...args} />);
  });

  it.todo("runs in standalone mode when a path is given", () => {
    args.paths = ["."];

    render(<Sut {...args} />);
  });

  it.todo("throws when no path is given and the registry in invalid", () => {
    args.paths = [];
    // TODO: Mock registry

    render(<Sut {...args} />);
  });

  it.todo("calls renderService for an initial run", () => {
    render(<Sut {...args} />);
  });

  it.todo("calls renderService on file changes", () => {
    render(<Sut {...args} />);
  });
});
