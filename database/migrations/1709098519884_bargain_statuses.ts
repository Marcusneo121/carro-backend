import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bargain_status'

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
      await db.table('bargain_status').insert([
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Bargaining' },
        { id: 2, name: 'Host_Accepted' },
        { id: 3, name: 'Host_Rejected' },
        { id: 4, name: 'Guest_Accepted' },
        { id: 5, name: 'Guest_Rejected' }
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
