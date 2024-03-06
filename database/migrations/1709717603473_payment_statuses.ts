import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payment_status'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table('payment_status').insert([
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Paid' },
        { id: 2, name: 'Payment_Failed' },
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
