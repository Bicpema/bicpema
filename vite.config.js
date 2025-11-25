import { resolve } from 'node:path';
import { globSync } from 'tinyglobby';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { getHtmlInputsRecursively } from './vite/_build/getHtmlInputsRecursively';

const root = resolve(__dirname, 'vite');
const outDir = resolve(__dirname, 'static/vite');

export default defineConfig({
  root,
  base: '/vite',
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputsRecursively(root),
    },
    chunkSizeWarningLimit: 1500,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  plugins: [
    // simulationsディレクトリを静的ファイルとしてコピーする
    viteStaticCopy({
      targets: [
        {
          src: resolve(root, 'simulations'),
          dest: outDir,
          overwrite: false,
        },
        {
          src: resolve(root, 'js'),
          dest: outDir,
          overwrite: false,
        },
      ],
    }),
    // vite-ignoreをしているファイルに差分があった際も再ビルドする
    // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394
    {
      name: 'watch-external',
      async buildStart() {
        const files = await globSync('vite/**/*');
        for (let file of files) {
          this.addWatchFile(file);
        }
      },
    },
  ],
});
