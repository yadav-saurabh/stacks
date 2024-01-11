import process from 'node:process'
import { Action } from '@stacksjs/enums'
import { runAction, runApiDevServer, runComponentsDevServer, runDocsDevServer, runFrontendDevServer } from '@stacksjs/actions'
import { ExitCode } from '@stacksjs/types'
import type { CLI, DevOptions } from '@stacksjs/types'
import { intro, log, outro, prompt, runCommand } from '@stacksjs/cli'
import { sleep } from '@stacksjs/utils'
import { libsPath } from '@stacksjs/path'

export function dev(buddy: CLI) {
  const descriptions = {
    dev: 'Starts development server',
    frontend: 'Starts the frontend development server',
    components: 'Start the Components development server',
    desktop: 'Start the Desktop App development server',
    dashboard: 'Start the Dashboard development server',
    api: 'Start the local API development server',
    email: 'Start the Email development server',
    docs: 'Start the Documentation development server',
    interactive: 'Get asked which development server to start',
    select: 'Which development server are you trying to start?',
    withLocalhost: 'Include the localhost URL in the output',
    verbose: 'Enable verbose output',
  }

  buddy
    .command('dev [server]', descriptions.dev)
    .option('-f, --frontend', descriptions.frontend)
    .option('-a, --api', descriptions.api)
    .option('-e, --email', descriptions.email)
    .option('-c, --components', descriptions.components)
    .option('-d, --dashboard', descriptions.dashboard)
    .option('-t, --desktop', descriptions.desktop)
    .option('-d, --docs', descriptions.docs)
    .option('-i, --interactive', descriptions.interactive, { default: false })
    .option('-l, --with-localhost', descriptions.withLocalhost, { default: false })
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (server: string | undefined, options: DevOptions) => {
      const perf = await intro('buddy dev')

      // log.info('Ensuring web server/s running...') // in other words, ensure caddy is running

      // // check if port 443 is open
      // const result = await runCommand('lsof -i :443', { silent: true })

      // if (result.isErr())
      //   log.warn('While checking if port 443 is open, we noticed it may be in use')

      // runAction(Action.StartCaddy, { ...options, silent: true })

      // just for a better UX
      await sleep(100)

      switch (server) {
        case 'frontend':
          await runFrontendDevServer(options)
          break
        case 'api':
          await runApiDevServer(options)
          break
        case 'components':
          await runComponentsDevServer(options)
          break
          // case 'dashboard':
          //   await runDashboardDevServer(options)
          //   break
        case 'desktop':
          await runDesktopDevServer(options)
          break
          // case 'email':
          //   await runEmailDevServer(options)
          //   break
        case 'docs':
          await runDocsDevServer(options)
          break
        default:
      }

      if (wantsInteractive(options)) {
        const answer = await prompt.require()
          .select(descriptions.select, {
            options: [
              { value: 'all', label: 'All' },
              { value: 'frontend', label: 'Frontend' },
              { value: 'api', label: 'Backend' },
              { value: 'desktop', label: 'Desktop' },
              { value: 'email', label: 'Email' },
              { value: 'components', label: 'Components' },
              { value: 'docs', label: 'Documentation' },
            ],
          })

        if (answer === 'components') {
          await runComponentsDevServer(options)
        }
        else if (answer === 'api') {
          await runApiDevServer(options)
        }
        // else if (answer === 'email')
        //   await runEmailDevServer(options)
        else if (answer === 'docs') {
          await runDocsDevServer(options)
        }

        else {
          log.error('Invalid option during interactive mode')
          process.exit(ExitCode.InvalidArgument)
        }
      }

      else {
        if (options.components)
          await runComponentsDevServer(options)
        if (options.docs)
          await runDocsDevServer(options)
        else if (options.api)
          await runApiDevServer(options)
        // else if (options.email)
        //   await runEmailDevServer(options)
      }

      await startDevelopmentServer(options)

      outro('Exited', { startTime: perf, useSeconds: true })
      process.exit(ExitCode.Success)
    })

  buddy
    .command('dev:components', descriptions.components)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: DevOptions) => {
      const perf = await intro('buddy dev:components')
      const result = await runCommand('bun run dev', {
        cwd: libsPath('components/vue'),
        // silent: !options.verbose,
      })

      if (options.verbose)
        log.info('buddy dev:components result', result)

      if (result.isErr()) {
        await outro('While running the dev:components command, there was an issue', { startTime: perf, useSeconds: true }, result.error)
        process.exit()
      }

      // eslint-disable-next-line no-console
      console.log('')
      await outro('Exited', { startTime: perf, useSeconds: true })
      process.exit(ExitCode.Success)
    })

  buddy
    .command('dev:docs', descriptions.docs)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: DevOptions) => {
      const perf = await intro('buddy dev:docs')
      const result = await runAction(Action.DevDocs, options)

      if (result.isErr()) {
        await outro('While running the dev:docs command, there was an issue', { startTime: perf, useSeconds: true }, result.error)
        process.exit()
      }

      // eslint-disable-next-line no-console
      console.log('')
      await outro('Exited', { startTime: perf, useSeconds: true })
      process.exit(ExitCode.Success)
    })

  buddy
    .command('dev:desktop', descriptions.desktop)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: DevOptions) => {
      const perf = await intro('buddy dev:desktop')
      const result = await runAction(Action.DevDesktop, options)

      if (result.isErr()) {
        await outro('While running the dev:desktop command, there was an issue', { startTime: perf, useSeconds: true }, result.error)
        process.exit()
      }

      // eslint-disable-next-line no-console
      console.log('')
      await outro('Exited', { startTime: perf, useSeconds: true })
      process.exit(ExitCode.Success)
    })

  buddy
    .command('dev:api', descriptions.api)
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: DevOptions) => {
      await runApiDevServer(options)
    })

  // buddy
  //   .command('dev:functions', descriptions.api)
  //   .option('--verbose', descriptions.verbose, { default: false })
  //   .action(async (options: DevOptions) => {
  //     await runFunctionsDevServer(options)
  //   })

  buddy
    .command('dev:frontend', descriptions.frontend)
    .alias('dev:pages')
    .alias('dev:views')
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: DevOptions) => {
      await runFrontendDevServer(options)
    })

  buddy.on('dev:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', buddy.args.join(' '))
    process.exit(1)
  })
}

export async function startDevelopmentServer(options: DevOptions) {
  const result = await runAction(Action.Dev, options)

  if (result.isErr()) {
    log.error('While running the dev command, there was an issue', result.error)
    process.exit(ExitCode.InvalidArgument)
  }
}

function wantsInteractive(options: DevOptions) {
  return options.interactive
}
