import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const cacheBustBuildAssets = () => ({
  name: "cache-bust-build-assets",
  transformIndexHtml(html: string) {
    const version = Date.now().toString();
    return html.replace(
      /(src|href)="([^"]+\.(?:js|css))"/g,
      `$1="$2?v=${version}"`,
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cacheBustBuildAssets()],
  base: "/3d-resume-/",
});
