import { alias, defineBuildConfig } from '@stacksjs/development'

export default defineBuildConfig({
  alias,

  entries: [
    './src/index',
  ],

  externals: [
    'vite',
    'vitepress',
  ],

  clean: false,
  declaration: true,
})
