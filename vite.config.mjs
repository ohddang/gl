import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["gl-matrix", "react", "react-dom", "react/jsx-runtime"],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ["src"],
    }),
  ],
});
