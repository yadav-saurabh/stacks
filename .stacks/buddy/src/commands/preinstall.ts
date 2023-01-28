import type { CLI, PreinstallOptions } from '@stacksjs/types'
import { invoke } from '@stacksjs/actions/preinstall'

async function preinstall(buddy: CLI) {
  const descriptions = {
    command: 'Run your preinstall script',
    verbose: 'Enable verbose output',
    debug: 'Enable debug mode',
  }

  buddy
    .command('preinstall', descriptions.command)
    .option('--verbose', descriptions.verbose, { default: false })
    .option('--debug', descriptions.debug, { default: false })
    .action(async (options: PreinstallOptions) => {
      await invoke(options)
    })
}

export { preinstall }
