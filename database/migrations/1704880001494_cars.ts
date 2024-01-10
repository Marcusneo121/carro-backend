import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('user_id').notNullable()
      table.string('car_name')
      table.string('color')
      table.string('engine_capacity')
      table.string('year_made')
      table.string('seat')
      table.string('location')
      table.string('car_main_pic')
      table.string('car_image_one')
      table.string('car_image_two')
      table.string('car_image_three')
      table.string('car_image_four')
      table.timestamp('available_to_date')
      table.timestamp('available_from_date')

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
