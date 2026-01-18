import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function htmlIncludePlugin() {
  function replaceIncludes(html, baseDir) {
    return html.replace(
      /<include\s+src=["'](.+?)["']\s*>(?:<\/include>)?/g,
      (_, srcPath) => {
        const resolved = path.resolve(baseDir, srcPath);
        const content = fs.readFileSync(resolved, 'utf-8');
        // Recursively process includes inside included files (always relative to src root)
        return replaceIncludes(content, baseDir);
      }
    );
  }

  return {
    name: 'html-include-plugin',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const baseDir = path.resolve(process.cwd(), 'src');
        return replaceIncludes(html, baseDir);
      },
    },
  };
}

export default defineConfig({
  root: 'src',
  base: '/bookshelf/',
  build: {
    outDir: path.resolve(process.cwd(), 'dist'),
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'src/index.html'),
        shopping: path.resolve(process.cwd(), 'src/shopping-list.html'),
      },
    },
  },
  plugins: [htmlIncludePlugin()],
});
