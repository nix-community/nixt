import "reflect-metadata";

import { Container } from "inversify";
import { bindings } from "../../bindings.js";
import { INixService } from "../../interfaces.js";
import { execSync } from "node:child_process";
import { schemaVer } from "../../types.js";
import { Mock } from "vitest";

vi.mock("node:child_process", () => ({
  execSync: vi.fn()
}));

const mockExecSync = execSync as Mock;

describe("NixService", () => {
  let registry: string
  let container: Container;
  let sut: INixService;

  beforeAll(() => {
    container = new Container;
    container.load(bindings);
    sut = container.get(INixService);
  })

  beforeEach(() => {
    registry = `{
      "__schema": "${schemaVer}",
      "settings": {
        "list": false,
        "watch": false,
        "verbose": false,
        "trace": false
      },
      "testSpec": [{
        "path": "./dummy.nix",
        "suites": [{
          "name": "Dummy",
          "cases": [{
            "name": "is a dummy suite",
            "expressions": [true]
          }]
        }]
      }]
    }`

    container.snapshot();
  })

  afterEach(() => {
    container.restore();
    vi.restoreAllMocks();
  })

  it("is defined", () => {
    expect(sut).toBeDefined();
  })

  it("returns an object when fetching", () => {
    mockExecSync.mockImplementationOnce((command: string) => {
      if (command.includes(".#__nixt") === true) return registry
      return {};
    })

    const result = sut.fetch(".#__nixt", false)

    expect(result).toStrictEqual(JSON.parse(registry))
  })

  it("returns an object when injecting", () => {
    mockExecSync.mockImplementationOnce((command: string) => {
      if (command.includes("./dummy.spec.nix") === true) return registry
      return {};
    })

    const result = sut.inject("./dummy.spec.nix", false)

    expect(result).toStrictEqual(JSON.parse(registry))
  })

  it("throws on invalid target", () => {
    const dummyError = "error: Dummy error";
    mockExecSync.mockReturnValue(dummyError);

    expect(sut.fetch).toThrowError(dummyError);
    expect(sut.inject).toThrowError(dummyError);
  })
})
