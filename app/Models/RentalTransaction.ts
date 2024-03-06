import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class RentalTransaction extends BaseModel {
  @column({ isPrimary: true, columnName: 'id' })
  public transaction_id: number

  @column({ columnName: 'car_id' })
  public car_id: number

  @column({ columnName: 'renter_id' })
  public renter_id: number

  @column({ columnName: 'bargain_id' })
  public bargain_id: number

  @column({ columnName: 'host_id' })
  public host_id: number

  //should be totaled price, to get perday or how many day rent can get from bargain_id
  @column()
  public price_agreed: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}