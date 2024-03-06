import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PaymentTransaction extends BaseModel {
  @column({ isPrimary: true })
  public payment_transaction_id: number

  @column()
  public stripe_payment_id: string

  @column()
  public stripe_customer_id: string

  @column()
  public bargain_id: number

  @column()
  public rental_transaction_id: number

  @column()
  public payment_status_id: number //get ID from payment status table

  @column()
  public total_amount: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
