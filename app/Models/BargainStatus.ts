import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Bargain from './Bargain'

export default class BargainStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: String

  @hasMany(() => Bargain)
  public user: HasMany<typeof Bargain>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
