/// <reference types="vitest" />
import { defaultExclude, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: [...defaultExclude, "./e2e/**/*"],
    alias: {
      "@": path.resolve(__dirname, "./")
    }
  }
});
