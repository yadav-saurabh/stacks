import {
  Err,
  Ok,
  Result,
  ResultAsync,
} from 'neverthrow'

export declare class ValidationError extends Error {
  messages: any
  status: number
  code: string
  constructor(messages: any, options?: ErrorOptions)
  get [Symbol.toStringTag](): string
  toString(): string
}

export type StacksError = Error | ValidationError

export {
  Err,
  Ok,
  Result,
  ResultAsync,
}
