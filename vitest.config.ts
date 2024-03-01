/// <reference types="vitest" />
import { defaultExclude, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: [...defaultExclude, "./e2e/**/*"],
  },
});
