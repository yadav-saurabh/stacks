import { intro, outro } from '@stacksjs/build'

const { startTime } = await intro({
  dir: import.meta.dir,
})

const result = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  format: 'esm',
  target: 'bun',

  external: [
    '@stacksjs/config',
    '@stacksjs/ui',
    '@stacksjs/utils',
    '@stacksjs/logging',
    '@stacksjs/validation',
    'meilisearch',
  ],
})

await outro({
  dir: import.meta.dir,
  startTime,
  result,
})
