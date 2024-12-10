import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class RequestLogger {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    // Capture request start time
    const startTime = process.hrtime()

    try {
      // Proceed with the next middleware/controller
      await next()
    } catch (error) {
      // Catch any errors and log them
      const [seconds, nanoseconds] = process.hrtime(startTime)
      const responseTime = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2) // Convert to ms
      const statusCode = response.response.statusCode // Get the final status code after error handling

      Logger.error(
        `Request: ${request.method()} ${request.url()} | IP: ${request.ip()} | Response: ${statusCode} | Time: ${responseTime}ms`
      )
      throw error
    }

    // Calculate response time after processing the request
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const responseTime = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2) // Convert to ms
    const statusCode = response.response.statusCode // Get the final status code after response is sent

    // Log successful requests
    Logger.info(
      `Request: ${request.method()} ${request.url()} | IP: ${request.ip()} | Response: ${statusCode} | Time: ${responseTime}ms`
    )
  }
}
