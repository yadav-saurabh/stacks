import type { CLI } from '@stacksjs/types'

async function setting(buddy: CLI) {
  // const descriptions = {
  //   command: 'Generate Setting Pages',
  //   verbose: 'Enable verbose output',
  // }
  //
  // buddy
  //   .command('page:setting', descriptions.command)
  //   .option('--verbose', descriptions.verbose, { default: false })
  //   .action(async () => {
  //     const startTime = await intro('buddy page:setting')
  //     const result = await runAction(Action.GenerateSettings)
  //
  //     if (result.isErr()) {
  //       log.error('Something went wrong when generating', result.error as Error)
  //       process.exit()
  //     }
  //
  //     outro('Pages generated successfully', { startTime })
  //   })
}

export { setting }
