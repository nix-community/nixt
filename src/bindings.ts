import { buildProviderModule } from "inversify-binding-decorators";

export * from "./run/index.js";
export * from "./components/index.js";

export const bindings = buildProviderModule();
