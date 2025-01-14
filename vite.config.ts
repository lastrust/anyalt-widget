import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src"]
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/AnyaltWidget.tsx"),
      name: "AnyaltWidget",
      formats: ["es", "umd"],
      fileName: (format) => `anyalt-widget.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@chakra-ui/react": "ChakraUI",
          "@emotion/react": "emotionReact",
          "@emotion/styled": "emotionStyled",
          "framer-motion": "framerMotion",
        },
      },
    },
  },
});
