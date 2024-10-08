await Bun.build({
  entrypoints: ['./src/index.ts'],

  outdir: './dist',
  format: 'esm',
  target: 'bun',
  sourcemap: 'linked',
  minify: true,

  external: ['@stacksjs/utils'],
})
