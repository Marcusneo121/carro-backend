import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import PaymentTransaction from './PaymentTransaction'

export default class PaymentStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: String

  @hasMany(() => PaymentTransaction)
  public user: HasMany<typeof PaymentTransaction>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
