import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Argon2 from "phc-argon2";
import { column, beforeSave, BaseModel, hasMany, HasMany, belongsTo, BelongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Favourite from './Favourite';
import Role from './Role';
import Profile from './Profile';
import Car from './Car';

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public roleId: number

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasMany(() => Car)
  public car: HasMany<typeof Car>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Argon2.hash(user.password)
    }
  }
}
