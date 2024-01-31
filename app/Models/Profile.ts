import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public address1: string

  @column()
  public address2: string

  @column()
  public address3: string

  @column()
  public age: number

  @column()
  public phoneNumber: string

  @column()
  public date_of_birth: Date

  @column()
  public profile_image: string //url

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
