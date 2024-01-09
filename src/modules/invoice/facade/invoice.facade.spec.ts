
import { Sequelize } from "sequelize-typescript";
import  InvoiceModel  from "../repository/invoice.model";
import  InvoiceItemModel  from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import { GenerateInvoiceFacadeInputDTO } from "./invoice.facade.interface";


describe("Invoice Facade tests", () => {
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

    it("should generate an invoice using Facade", async () => {
        
        const invoiceFacade = InvoiceFacadeFactory.create();
        const input: GenerateInvoiceFacadeInputDTO = {
            name: "Product 1",
            document: "Description 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zip Code 1",
            items: [
                {
                id: "1",
                name: "Item 1",
                price: 100,
                },
                {
                id: "2",
                name: "Item 2",
                price: 100,
                },
            ],
        };
    
        const result = await invoiceFacade.generate(input);
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
    });

    it("should find an invoice using Facade", async () => {

        const invoiceFacade = InvoiceFacadeFactory.create();
        const input: GenerateInvoiceFacadeInputDTO = {
            name: "Product 1",
            document: "Description 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zip Code 1",
            items: [
                {
                id: "1",
                name: "Item 1",
                price: 100,
                },
                {
                id: "2",
                name: "Item 2",
                price: 100,
                },
            ],
        };

        const invoiceCreated = await invoiceFacade.generate(input);

        const result = await invoiceFacade.find({id: invoiceCreated.id});
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.address.street).toBe(input.street);
        expect(result.address.number).toBe(input.number);
        expect(result.address.complement).toBe(input.complement);
        expect(result.address.city).toBe(input.city);
        expect(result.address.state).toBe(input.state);
        expect(result.address.zipCode).toBe(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
        


    });
});