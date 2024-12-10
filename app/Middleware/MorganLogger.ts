import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Morgan from 'morgan'

export default class MorganLogger {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // Initialize Morgan with a format
    const logger = Morgan('dev')

    // Use the logger for the request
    logger(ctx.request.request, ctx.response.response, () => {})

    // Proceed to the next middleware/controller
    await next()
  }
}
