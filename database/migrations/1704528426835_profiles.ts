import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('user_id').notNullable()
      table.string("first_name")
      table.string("last_name")
      table.string("address1")
      table.string("address2")
      table.string("address3")
      table.bigint("age")
      table.string("phone_number")
      table.dateTime("date_of_birth")
      table.string("profile_image")

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.string("poscode")
      table.string("city")
      table.string("state")
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
