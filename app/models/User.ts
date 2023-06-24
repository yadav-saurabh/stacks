import { faker } from '@stacksjs/faker'
import { string } from '@stacksjs/validation'
import { defineModel } from '@stacksjs/utils'

export default defineModel({
  name: 'User', // defaults to the sanitized file name
  table: 'users',
  authenticatable: true, // boolean | AuthSettings (including TokenSettings)
  searchable: true, // boolean | IndexSettings,
  seedable: { // boolean | SeedSettings,
    count: 10,
  },
  fields: {
    name: {
      validator: {
        rule: string.minLength(3).maxLength(255).nullable(),
        message: 'Name must be between 3 and 255 characters',
      },
      factory: () => faker.person.fullName(),
    },
    email: {
      unique: true,
      validator: {
        rule: string.email(),
        message: 'Email must be a valid email address',
      },
      factory: () => faker.internet.email(),
    },
    password: {
      validator: {
        rule: string.minLength(6).maxLength(255),
        message: 'Password must be between 6 and 255 characters',
      },
      factory: () => faker.internet.password(),
    },
  },
})
