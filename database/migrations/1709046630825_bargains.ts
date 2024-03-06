import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bargains'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('transaction_id').nullable()
      table.integer('renter_id')
      table.integer('host_id')
      table.integer('car_id')
      table.string('bargain_amount')
      table.integer('last_bargain_user')
      table.string('last_bargain_amount')
      table.integer('days_of_rental').notNullable()
      table.integer('bargain_status_id').notNullable()
      table.timestamp('rent_from_date').notNullable()
      table.timestamp('rent_to_date').notNullable()
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
