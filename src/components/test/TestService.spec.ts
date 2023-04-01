import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { INixService, TestService } from "../../interfaces.js";
import { CliArgs, TestFile } from "../../types.js";
import { resolve } from "path";

const nixService = {
  fetch: vi.fn(),
  inject: vi.fn(),
};

describe("TestService", () => {
  let container: Container;
  let args: CliArgs;
  let dummyFile: TestFile;
  let dummySpec: TestFile[];
  let sut: TestService;

  beforeAll(() => {
    container = new Container();

    container.load(bindings);
    container.rebind(INixService).toConstantValue(nixService);

    sut = container.get(TestService);
  });

  beforeEach(() => {
    container.snapshot();
    args = {
      paths: ["."],
      watch: false,
      verbose: [false, false],
      list: false,
      recurse: false,
      debug: false,
      help: false,
    };
    dummyFile = {
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
    };
    dummySpec = [dummyFile];
  });

  afterEach(() => {
    container.restore();
    vi.restoreAllMocks();
  });

  it("is defined", () => {
    expect(sut).toBeDefined();
  });

  it("returns spec for valid files", async () => {
    nixService.inject.mockImplementationOnce(async (target: string) => {
      if (target.includes(".spec.nix") === true) return dummyFile;
      return {};
    });
    args.paths = ["./examples/valid.spec.nix"];

    const result = await sut.run(args);

    expect(result).toStrictEqual(dummySpec);
  });

  it("returns spec for multiple paths", async () => {
    nixService.inject.mockImplementation(async (target: string) => {
      if (target.includes(".spec.nix") === true) return dummyFile;
      return {};
    });
    const path = "./examples/valid.spec.nix";
    args.paths = [path, path];

    const result = await sut.run(args);

    dummySpec = [dummyFile, dummyFile];
    expect(result).toStrictEqual(dummySpec);
  });

  it("handles NixService errors", async () => {
    nixService.inject.mockImplementationOnce(async () => {
      throw new Error("error: something went wrong");
    });
    const path = "./examples/valid.spec.nix";
    args.paths = [path];

    const result = await sut.run(args);

    dummySpec = [
      {
        path: resolve(path),
        suites: [],
        importError: "error: something went wrong",
      },
    ];
    expect(result).toEqual(dummySpec);
  });
});
