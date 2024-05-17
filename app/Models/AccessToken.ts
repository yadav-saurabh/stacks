import { faker } from '@stacksjs/faker'
import type { Model } from '@stacksjs/types'
import { schema } from '@stacksjs/validation'

export default {
  name: 'AccessToken', // defaults to the sanitized file name
  table: 'access_tokens', // defaults to the lowercase, plural name of the model
  primaryKey: 'id', // defaults to `id`
  autoIncrement: true, // defaults to true

  hasOne: ['Team'],

  traits: {
    useTimestamps: true, // defaults to true
    useSeeder: {
      // defaults to a count of 10
      count: 10,
    },
  },

  attributes: {
    name: {
      validator: {
        rule: schema.string(),
        message: '`name` must be a string',
      },

      factory: () => faker.lorem.sentence({ min: 3, max: 6 }),
    },

    token: {
      unique: true,
      validator: {
        rule: schema.string(),
        message: '`token` must be a string',
      },

      factory: () => faker.random.uuid(),
    },
  },
} satisfies Model
