import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "./bindings.js";
import {
  IApp,
  INixService,
  IRenderService,
  TestService,
} from "./interfaces.js";
import { CliArgs, Schema, schemaVer } from "./types.js";

const nixService = {
  fetch: vi.fn(),
  inject: vi.fn(),
};

const renderService = {
  run: vi.fn(),
};

const testService = {
  run: vi.fn(),
};

describe("App", () => {
  let container: Container;
  let sut: IApp;
  let args: CliArgs;
  let registry: Schema;

  beforeAll(() => {
    container = new Container();

    container.load(bindings);
    container.rebind(INixService).toConstantValue(nixService);
    container.rebind(IRenderService).toConstantValue(renderService);
    container.rebind(TestService).toConstantValue(testService);

    sut = container.get(IApp);
  });

  beforeEach(() => {
    args = {
      paths: [],
      watch: false,
      verbose: false,
      showTrace: false,
      list: false,
      recurse: false,
      debug: false,
    };

    registry = {
      __schema: schemaVer,
      settings: {
        list: false,
        watch: false,
        verbose: false,
        trace: false,
      },
      testSpec: [
        {
          path: "./dummy.nix",
          suites: [
            {
              name: "Dummy",
              cases: [
                {
                  name: "is a dummy suite",
                  expressions: [true],
                },
              ],
            },
          ],
        },
      ],
    };

    container.snapshot();
  });

  afterEach(() => {
    container.restore();
    vi.restoreAllMocks();
  });

  it("is defined", () => {
    expect(sut).toBeDefined();
  });

  it("runs in flake mode when no path is given", async () => {
    nixService.fetch.mockReturnValueOnce(registry);

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledTimes(0);
    expect(renderService.run).toHaveBeenCalledWith(args, registry.testSpec);
  });

  it("runs in standalone mode when a path is given", async () => {
    testService.run.mockReturnValueOnce([]);

    args.paths = ["."];

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledOnce();
  });

  it.todo("throws when no path is given and the registry in invalid");

  it("calls renderService once when watch is false", async () => {
    nixService.fetch.mockReturnValueOnce(registry);

    args.watch = false;

    await sut.run(args);

    expect(renderService.run).toHaveBeenCalledOnce();
  });

  it("calls renderService for an initial run when watch is true", async () => {
    nixService.fetch.mockReturnValueOnce(registry);

    args.watch = true;

    await sut.run(args);

    expect(renderService.run).toHaveBeenCalled();
  });
});
