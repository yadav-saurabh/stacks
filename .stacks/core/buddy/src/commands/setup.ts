import process from 'node:process'
import { path as p } from '@stacksjs/path'
import { handleError } from '@stacksjs/error-handling'
import { log, runCommand } from '@stacksjs/cli'
import { ExitCode } from '@stacksjs/types'
import type { CLI, CliOptions } from '@stacksjs/types'

export function setup(buddy: CLI) {
  const descriptions = {
    ensure: 'This command ensures your project is setup correctly',
    setup: 'This command sets up your project for the first time',
    verbose: 'Enable verbose output',
  }

  buddy
    .command('ensure', descriptions.ensure)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: CliOptions) => {
      await runCommand('bun install', options)
    })

  buddy
    .command('setup', descriptions.setup)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: CliOptions) => {
      if (await ensureTeaIsInstalled())
        await optimizeTeaDeps()
      else
        await installTea()

      await initializeProject(options)
    })

  buddy.on('setup:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', buddy.args.join(' '))
    process.exit(ExitCode.FatalError)
  })
}

async function ensureTeaIsInstalled(): Promise<boolean> {
  const result = await runCommand('tea --version', { silent: true })

  if (result.isOk())
    return true

  return false
}

async function installTea(): Promise<void> {
  const result = await runCommand('./scripts/setup.sh')

  if (result.isOk())
    return

  handleError(result.error)
  process.exit(ExitCode.FatalError)
}

async function initializeProject(options: CliOptions): Promise<void> {
  log.info('⏳ Installing npm dependencies...')
  await new Promise(resolve => setTimeout(resolve, 1500))

  const result = await runCommand('bun install', {
    cwd: options.cwd || p.projectPath(),
  })

  if (result.isErr()) {
    handleError(result.error)
    process.exit(ExitCode.FatalError)
  }

  log.success('Installed npm dependencies')
  await new Promise(resolve => setTimeout(resolve, 300))

  log.info('⏳ Ensuring .env exists...')
  await new Promise(resolve => setTimeout(resolve, 800))

  const envResult = await runCommand('cp .env.example .env', {
    cwd: options.cwd || p.projectPath(),
  })

  if (envResult.isErr()) {
    handleError(envResult.error)
    process.exit(ExitCode.FatalError)
  }

  log.success('.env exists')

  log.info('⏳ Generating application key...')
  await new Promise(resolve => setTimeout(resolve, 1200))

  const keyResult = await runCommand('buddy key:generate', {
    cwd: options.cwd || p.projectPath(),
  })

  if (keyResult.isErr()) {
    handleError(keyResult.error)
    process.exit(ExitCode.FatalError)
  }

  log.success('Generated application key')
  await new Promise(resolve => setTimeout(resolve, 300))

  log.info('⏳ Ensuring AWS is connected...')
  await new Promise(resolve => setTimeout(resolve, 1200))

  const awsResult = await runCommand('buddy configure:aws', {
    cwd: options.cwd || p.projectPath(),
  })

  if (awsResult.isErr()) {
    handleError(awsResult.error)
    process.exit(ExitCode.FatalError)
  }

  log.success('Configured AWS')
  await new Promise(resolve => setTimeout(resolve, 300))

  // ensure the IDE is setup

  log.success('Project is setup')
  await new Promise(resolve => setTimeout(resolve, 300))

  log.info('🎉 Happy coding!')
}

export async function optimizeTeaDeps(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 300))
}
