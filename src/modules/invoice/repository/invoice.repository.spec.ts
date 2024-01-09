import { Sequelize } from "sequelize-typescript";
import  InvoiceModel  from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-items.entity";
import  InvoiceItemModel  from "./invoice-item.model";


describe("InvoiceRepository tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ":memory:",
          logging: false,
          sync: { force: true },
        });
    
        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("Should create a invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        const invoice: Invoice = new Invoice({
            id: new Id("1"),
            name: "Teste",
            document: "123456789",
            address: new Address(
                "Rua teste",
                "123",
                "complemento",
                "cidade",
                "estado",
                "12345678"
            ),
            items: [
                new InvoiceItem({
                    id: new Id("1"),
                    name: "item 1",
                    price: 10,
                }),
                new InvoiceItem({
                    id: new Id("2"),
                    name: "item 2",
                    price: 20,
                }),
            ],
        });

        await invoiceRepository.generate(invoice);

        const invoiceModel = await InvoiceModel.findOne({where: {id: "1"}, include: ["items"]});

        expect(invoiceModel.id).toBe("1");
        expect(invoiceModel.name).toBe("Teste");
        expect(invoiceModel.document).toBe("123456789");
        expect(invoiceModel.street).toBe("Rua teste");
        expect(invoiceModel.number).toBe("123");
        expect(invoiceModel.complement).toBe("complemento");
        expect(invoiceModel.city).toBe("cidade");
        expect(invoiceModel.state).toBe("estado");
        expect(invoiceModel.zipcode).toBe("12345678");
        expect(invoiceModel.items.length).toBe(2);
        expect(invoiceModel.items[0].id).toBe("1");
        expect(invoiceModel.items[0].name).toBe("item 1");
        expect(invoiceModel.items[0].price).toBe(10);
        expect(invoiceModel.items[1].id).toBe("2");
        expect(invoiceModel.items[1].name).toBe("item 2");
        expect(invoiceModel.items[1].price).toBe(20);
      })
      
    it("Should return a invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        await InvoiceModel.create({
            id: "1",
            name: "Teste",
            document: "123456789",
            street: "Rua teste",
            number: "123",
            complement: "complemento",
            city: "cidade",
            state: "estado",
            zipcode: "12345678",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          const invoice = await invoiceRepository.find("1");

          expect(invoice.id.id).toBe("1");
          expect(invoice.name).toBe("Teste");
          expect(invoice.document).toBe("123456789");
          expect(invoice.address.street).toBe("Rua teste");
          expect(invoice.address.number).toBe("123");
          expect(invoice.address.complement).toBe("complemento");
          expect(invoice.address.city).toBe("cidade");
          expect(invoice.address.state).toBe("estado");
          expect(invoice.address.zipCode).toBe("12345678");
    });


});