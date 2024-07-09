import { Action } from '@stacksjs/actions'
import { attempt } from '@stacksjs/auth'
// import { epmailSubscribeRequest } from '@stacksjs/validation'
import type { RequestInstance } from '@stacksjs/types'
import { schema } from '@stacksjs/validation'

export default new Action({
  name: 'LoginAction',
  description: 'Login to Dashboard',
  method: 'POST',
  async handle(request: RequestInstance) {
    const email = request.get('email')
    const password = request.get('password')

    await request.validate({
      email: {
        validation: {
          rule: schema.string().email(),
          message: {
            email: 'Email must be a valid email address',
          },
        },
      },

      password: {
        validation: {
          rule: schema.string().minLength(6).maxLength(255),
          message: {
            minLength: 'Password must have a minimum of 6 characters',
            maxLength: 'Password must have a maximum of 255 characters',
          },
        },
      },
    })

    if (await attempt({ email, password })) {
      return 'success'
    }

    return 'fail'
  },
})
