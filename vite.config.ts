import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { defineConfig } from "vite"


const root = resolve(".", "src")
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
      "@components": resolve(root, "components"),
      "@theme": resolve(root, "theme"),
    },
  },
})
