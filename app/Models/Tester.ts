import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Tester extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public testerTitle: string

  @column()
  public name: string

  @column()
  public age: string

  @column()
  public power: string

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
