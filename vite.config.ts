import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
    define: {
        'import.meta.vitest': 'undefined',
    },
    test: {
        globals: true,
        includeSource: ['src/**/*.{jsx?,tsx?}'],
        exclude: [...configDefaults.exclude, '**/.direnv/**'],
    },
});
