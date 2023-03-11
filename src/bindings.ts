import { buildProviderModule } from "inversify-binding-decorators";

export * from "./App.js";
export * from "./components/index.js";

export const bindings = buildProviderModule();
