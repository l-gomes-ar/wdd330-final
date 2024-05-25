import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        home: resolve(__dirname, "src/index.html"),
        cryptocurrencies: resolve(__dirname, "src/cryptocurrencies/index.html"),
        watchlist: resolve(__dirname, "src/watchlist/index.html")
      }
    }
  }
});
