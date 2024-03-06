import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rental_transactions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("host_id")
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("host_id")
    })
  }
}