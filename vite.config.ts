import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude, '**/.direnv/**'],
    watchExclude: [...configDefaults.watchExclude, "**/.direnv/**"]
  },
});
