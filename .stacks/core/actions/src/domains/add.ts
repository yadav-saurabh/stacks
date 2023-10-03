import process from 'node:process'
import { createHostedZone } from '@stacksjs/dns'
import { app } from '@stacksjs/config'
import { handleError } from '@stacksjs/error-handling'
import { italic, parseOptions } from '@stacksjs/cli'
import { whois } from '@stacksjs/whois'
import { logger } from '@stacksjs/logging'
import { projectConfigPath } from '@stacksjs/path'

interface AddOptions {
  domain?: string
  verbose: boolean
}

const parsedOptions = parseOptions()
const options: AddOptions = {
  domain: parsedOptions.domain as string,
  verbose: parsedOptions.verbose as boolean,
}

if (!options.domain) {
  if (app.url) {
    options.domain = app.url
  }
  else {
    handleError('there was no domain provided when')
    process.exit(1)
  }
}

const result = await createHostedZone(options.domain)

if (result.isErr()) {
  handleError(result.error)
  process.exit(1)
}

const nameservers = result.value
const registrar: string = (await whois(options.domain, true)).parsedData.Registrar

// usually for Route53 registered domains, we don't need to update crete a hosted zone as it's already
// done for us. But in case it's not, we'll still need to ensure it's created technically, we
// could automatically run the deploy command after instead of prompting the user
if (registrar.includes('Amazon')) {
  logger.log('')
  logger.log('You can now continue your deployment process by running again:')
  logger.log('')
  logger.log(`  ➡️  ${italic('buddy deploy')}`)
  logger.log('')
  process.exit(0)
}

logger.log('')
logger.log('ℹ️  Please note, before continuing your deployment process,')
logger.log(`   update your ${registrar} nameservers to the following:`)

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
logger.log('')
nameservers.forEach((nameserver, index) => {
  logger.log(`  ${emojis[index]}  Nameserver: ${nameserver}`)
})
logger.log('')
logger.log(italic(`stored in ${projectConfigPath('dns.ts')}`))
logger.log('')
logger.log('Once the nameservers have been updated, re-run the following command:')
logger.log('')
logger.log(`  ➡️  ${italic('buddy deploy')}`)
logger.log('')
