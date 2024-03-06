import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payment_transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('payment_transaction_id')
      table.string('stripe_payment_id').nullable()
      table.string('stripe_customer_id')
      table.integer('bargain_id')
      table.integer('rental_transaction_id')
      table.integer('payment_status_id')
      table.string('total_amount')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
