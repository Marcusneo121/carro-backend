import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @column()
  public carName: string

  @column()
  public carPlate: string

  @column()
  public color: string

  @column()
  public engineCapacity: string

  @column()
  public yearMade: string

  @column()
  public seat: string

  @column()
  public location: string

  @column()
  public carMainPic: string

  @column()
  public carImageOne: string

  @column()
  public carImageTwo: string

  @column()
  public carImageThree: string

  @column()
  public carImageFour: string

  @column()
  public price: string

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    },
  })
  public availableFromDate: DateTime

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    },
  })
  public availableToDate: DateTime

  @column()
  public is_electric: boolean

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc').toISO() : value
    },
  })
  public updatedAt: DateTime
}
