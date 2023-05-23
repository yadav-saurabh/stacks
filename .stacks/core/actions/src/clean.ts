import { log } from '@stacksjs/cli'
import { projectPath } from '@stacksjs/path'
import { del } from '@stacksjs/utils'

log.info('Running clean command...')

await del([
  projectPath('pnpm-lock.yaml'),
  projectPath('node_modules/'),
  projectPath('.stacks/**/dist'),
  projectPath('.stacks/**/node_modules'),
])
