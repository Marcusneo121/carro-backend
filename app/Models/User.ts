import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Argon2 from "phc-argon2";
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public age: number

  @column()
  public date_of_birth: Date

  @column()
  public profile_image: string //url

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Argon2.hash(user.password)
    }
  }
}
