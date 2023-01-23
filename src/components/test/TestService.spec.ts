import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { INixService, TestService } from "../../interfaces.js";
import { CliArgs } from "../../types.js";

const nixService = {
  run: vi.fn(() => {
    return {};
  }),
};

describe("TestService", () => {
  let container: Container;
  let args: CliArgs;
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
  });

  afterEach(() => {
    container.restore();
  });

  it("is defined", () => {
    expect(sut).toBeDefined();
  });

  it("returns spec for valid files");

  it.todo("handles NixService errors");
});
