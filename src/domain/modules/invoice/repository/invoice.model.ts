import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";

@Table({
  modelName: "invoice-table",
  tableName: "invoice",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column
  declare street: string;

  @Column
  declare number: string;

  @Column
  declare complement: string;

  @Column
  declare city: string;

  @Column
  declare state: string;

  @Column
  declare zipCode: string;

  @HasMany(() => InvoiceItemModel)
  declare items: InvoiceItemModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
