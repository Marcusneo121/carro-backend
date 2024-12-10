import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class RequestLogger {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    // Capture request start time
    const startTime = process.hrtime()

    // Log request details
    Logger.info(`Request: ${request.method()} ${request.url()} | IP: ${request.ip()}`)

    await next()

    // Calculate response time
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const responseTime = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2) // Convert to ms

    // Retrieve response status
    const statusCode = response.response.statusCode

    // Log response details
    Logger.info(`Response: ${statusCode} | Time: ${responseTime}ms`)
  }
}
