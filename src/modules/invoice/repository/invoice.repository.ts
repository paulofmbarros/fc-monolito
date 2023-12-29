import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-items.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
   async find(id: string): Promise<Invoice> {
        const invoiceModel = await InvoiceModel.findOne({
            where: { id },
            include: ["items"],
          });
      
          if (!invoiceModel) return null;
      
          const invoiceItems = invoiceModel.items.map((item) => {
            return new InvoiceItem( {
            id : new Id(item.id),
              name: item.name,
              price:item.price
          });
          });
          return new Invoice({
            id: new Id(invoiceModel.id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: new Address (
                invoiceModel.street,
                invoiceModel.number,
                invoiceModel.complement,
                invoiceModel.city,
                invoiceModel.state,
                invoiceModel.zipcode,
            ),

            items: invoiceItems,
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt,
          
          });
    }
    
   async generate(invoice: Invoice): Promise<Invoice> {
   var invoiceModel = await InvoiceModel.create({
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        items : invoice.items.map((item) => {
            return {
                id: item.id.id,
                name: item.name,
                price: item.price,
            }
        }),
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipcode: invoice.address.zipCode,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: ["items"],
      }
      );
  
      return new Invoice({
        id: new Id(invoiceModel.id),
        name: invoiceModel.name,
        document: invoiceModel.document,
        address: new Address(
            invoiceModel.street,
            invoiceModel.number,
            invoiceModel.complement,
            invoiceModel.city,
            invoiceModel.state,
            invoiceModel.zipcode,
        ),
        items: invoiceModel.items.map((item) => {
            return new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            });
        }),
        createdAt: invoiceModel.createdAt,
        updatedAt: invoiceModel.updatedAt,
      });
    };
}