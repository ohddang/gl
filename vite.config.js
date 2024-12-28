import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "WebGLRenderer",
      formats: ["es", "umd", "cjs"],
    },
    rollupOptions: {
      external: ["gl-matrix"],
      output: {
        globals: {
          "gl-matrix": "glMatrix",
        },
      },
    },
  },
  plugins: [dts()],
});
