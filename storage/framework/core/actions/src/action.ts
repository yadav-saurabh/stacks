import type { JobOptions, Nullable } from '@stacksjs/types'
import type { ValidationBoolean, ValidationNumber, ValidationString } from '@stacksjs/validation'

type ValidationKey = string
interface ValidationValue {
  rule: ValidationString | ValidationNumber | ValidationBoolean | Date | Nullable<any>
  message: string
}

interface ActionOptions {
  name?: string
  description?: string
  apiResponse?: boolean
  validations?: Record<ValidationKey, ValidationValue>
  path?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  rate?: JobOptions['rate']
  tries?: JobOptions['tries']
  backoff?: JobOptions['backoff']
  enabled?: JobOptions['enabled']
  requestFile?: string
  handle: (request: any) => Promise<any>
}

export class Action {
  name?: string
  description?: string
  rate?: ActionOptions['rate']
  tries?: ActionOptions['tries']
  backoff?: ActionOptions['backoff']
  enabled?: ActionOptions['enabled']
  path?: ActionOptions['path']
  method?: ActionOptions['method']
  validations?: Record<ValidationKey, ValidationValue>
  requestFile?: string
  handle: ActionOptions['handle']

  constructor({
    name,
    description,
    validations,
    handle,
    rate,
    tries,
    backoff,
    enabled,
    path,
    method,
    requestFile,
  }: ActionOptions) {
    // log.debug(`Action ${name} created`) // TODO: this does not yet work because the cloud does not yet have proper file system (efs) access

    this.name = name
    this.description = description
    this.validations = validations
    this.rate = rate
    this.tries = tries
    this.backoff = backoff
    this.enabled = enabled
    this.path = path
    this.method = method
    this.handle = handle
    this.requestFile = requestFile
  }
}
