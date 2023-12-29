import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceItemModel } from "./invoice-item.model";

@Table({
    tableName: 'invoices',
    timestamps: false
})
export class InvoiceModel extends Model{

    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string

    @Column({ allowNull: false })
    document: string

    @HasMany(() => InvoiceItemModel)
    declare items: InvoiceItemModel[];

    @Column({ allowNull: false})
    declare street: string;

    @Column({ allowNull: false})
    declare number: string;

    @Column({ allowNull: false})
    declare complement: string;

    @Column({ allowNull: false})
    declare zipcode: string;

    @Column({ allowNull: false})
    declare city: string;

    @Column({ allowNull: false})
    declare state: string;

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
}