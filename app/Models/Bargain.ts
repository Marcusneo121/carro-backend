import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Bargain extends BaseModel {
  @column({ isPrimary: true})
  public id: number

  @column({ columnName: 'transaction_id' })
  public transaction_id: number

  @column({ columnName: 'renter_id' })
  public renter_id: number

  @column({ columnName: 'host_id' })
  public host_id: number

  @column({ columnName: 'car_id' })
  public car_id: number

  @column()
  public bargain_amount: string

  @column()
  public last_bargain_user: number

  @column()
  public last_bargain_amount: string

  @column()
  public days_of_rental: number

  @column({ columnName: 'bargain_status_id' })
  public bargain_status_id: number //get ID from bargain status table

  @column()
  public rent_from_date: DateTime

  @column()
  public rent_to_date: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
