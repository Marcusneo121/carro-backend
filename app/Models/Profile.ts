import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public age: number

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public date_of_birth: Date

  @column()
  public profile_image: string //url

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
