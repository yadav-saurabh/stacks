import { defineBuildConfig } from 'unbuild'
import { alias } from './src'

export default defineBuildConfig({
  alias,

  entries: [
    './src/index',
  ],

  clean: false, // logging, alias, development, storage, and path are all prerequisites for other packages—needed for the release process
  declaration: true,
})
