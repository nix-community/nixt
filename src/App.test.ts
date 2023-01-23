import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "./bindings.js";
import { IApp, INixService, IRenderService, TestService } from "./interfaces.js";
import { CliArgs, Schema, schemaVer, TestFile } from "./types.js";

const nixService = {
  fetch: vi.fn(() => { return {} }),
  inject: vi.fn(() => { return {} })
}

const renderService = {
  run: vi.fn()
}

const testService = {
  run: vi.fn(async (): Promise<TestFile[]> => { return [] })
}

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
      verbose: [false, false],
      list: false,
      recurse: false,
      debug: false,
      help: false,
    };

    registry = {
      __schema: schemaVer,
      settings: {
        list: false,
        watch: false,
        verbose: false,
        trace: false
      },
      testSpec: [{
        path: "./dummy.nix",
        suites: [{
          name: "Dummy",
          cases: [{
            name: "is a dummy suite",
            expressions: [true]
          }]
        }]
      }]
    }

    container.snapshot();
  });

  afterEach(() => {
    container.restore();
    vi.restoreAllMocks();
  });

  it("is defined", () => {
    expect(sut).toBeDefined();
  });

  it("runs in standalone mode when a path is given", async () => {
    args.paths = ["."];

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledOnce();
  });

  it("runs in flake mode when no path is given", async () => {
    nixService.fetch.mockReturnValueOnce(registry);

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledTimes(0);
    expect(renderService.run).toHaveBeenCalledWith(args, registry.testSpec);
  });

  it("runs in standalone mode when the nixt registry is inaccessible", async () => {
    nixService.fetch.mockImplementationOnce(() => {
      throw new Error("error: Dummy error");
    })

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledOnce();
    expect(renderService.run).toHaveBeenCalledWith(args, []);
  });

  it("runs in standalone mode when the nixt registry is malformed", async () => {
    nixService.fetch.mockReturnValueOnce({ __schema: schemaVer, testSpec: "This isn't an array." });

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledOnce();
    expect(renderService.run).toHaveBeenCalledWith(args, []);
  });

  it("runs in standalone mode when the nixt registry uses an unsupported schema", async () => {
    registry.__schema = "v9001"
    nixService.fetch.mockReturnValueOnce(registry);

    await sut.run(args);

    expect(testService.run).toHaveBeenCalledOnce();
    expect(renderService.run).toHaveBeenCalledWith(args, []);
  });

  it("calls renderService once when watch is false", async () => {
    args.watch = false;

    await sut.run(args);

    expect(renderService.run).toHaveBeenCalledOnce();
  })

  it("calls renderService for an initial run when watch is true", async () => {
    args.watch = true;

    await sut.run(args);

    expect(renderService.run).toHaveBeenCalled();
  })
});
