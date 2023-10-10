import process from 'node:process'
import type { CLI, DeployOptions } from '@stacksjs/types'
import { runAction } from '@stacksjs/actions'
import { intro, italic, log, outro } from '@stacksjs/cli'
import { Action, ExitCode } from '@stacksjs/types'
import { app } from '@stacksjs/config'
import { addDomain, hasUserDomainBeenAddedToCloud } from '@stacksjs/dns'

export function deploy(buddy: CLI) {
  const descriptions = {
    deploy: 'Reinstalls your npm dependencies',
    verbose: 'Enable verbose output',
  }

  buddy
    .command('deploy', descriptions.deploy)
    .option('--domain', 'Specify a domain to deploy to', { default: undefined })
    .option('--verbose', descriptions.verbose, { default: false })
    .action(async (options: DeployOptions) => {
      const startTime = await intro('buddy deploy')
      const domain = options.domain || app.url

      if (!domain) {
        log.info('We could not identify a domain to deploy to.')
        log.info('Please set your .env or ./config/app.ts properly.')
        log.info('')
        log.info('ℹ️  Alternatively, specify a domain to deploy via the `--domain` flag.')
        log.info('')
        log.info('   ➡️  Example: `buddy deploy --domain example.com`')
        log.info('')
        process.exit(ExitCode.FatalError)
      }

      if (await hasUserDomainBeenAddedToCloud(domain)) {
        log.info('')
        log.info('✅ Your domain is properly configured.')
        log.info('ℹ️  Your cloud is deploying.')
        log.info('')
        log.info(italic('⏳ This may take a while...'))
        log.info('')
        await new Promise(resolve => setTimeout(resolve, 2000))
        options.domain = domain
      }

      // if the domain hasn't been added to the user's (AWS) cloud, we will add it for them
      // and then exit the process with prompts for the user to update their nameservers
      else {
        log.info('')
        log.info(`👋  It appears to be your first ${italic(domain)} deployment.`)
        log.info('')
        log.info(italic('Let’s ensure it is all connected properly.'))
        log.info(italic('One moment...'))
        log.info('')

        options.domain = domain
        const result = await addDomain({
          ...options,
          deploy: true,
          startTime,
        })

        if (result.isErr()) {
          await outro('While running the `buddy deploy`, there was an issue', { startTime, useSeconds: true }, result.error)
          process.exit(ExitCode.FatalError)
        }

        await outro('Added your domain.', { startTime, useSeconds: true })
        process.exit(ExitCode.Success)
      }

      // now that we know the domain has been added to the users (AWS) cloud, we can deploy
      const result = await runAction(Action.Deploy, options)

      if (result.isErr()) {
        await outro('While running the `buddy deploy`, there was an issue', { startTime, useSeconds: true }, result.error)
        process.exit(ExitCode.FatalError)
      }

      await outro('Deployment succeeded.', { startTime, useSeconds: true })

      process.exit(ExitCode.Success)
    })

  buddy.on('deploy:*', () => {
    log.error('Invalid command: %s\nSee --help for a list of available commands.', buddy.args.join(' '))
    process.exit(1)
  })
}
