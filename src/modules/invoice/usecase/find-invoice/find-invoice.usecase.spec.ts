import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";


const address =({
    street: "Street 1",
    number: "Number 1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "Zip Code 1",
});

const item1: InvoiceItem = new InvoiceItem({
    id: new Id("1"),
    name: "Item 1",
    price: 100,
});

const item2: InvoiceItem = new InvoiceItem({
    id: new Id("2"),
    name: "Item 2",
    price: 100,
});


const invoice = new Invoice({
    id: new Id("1"),
    name: "Product 1",
    document: "Description 1",
    address: new Address(
         address.street,
          address.number,
          address.complement,
          address.city,
          address.state,
          address.zipCode,
        
    ),
    items: [item1,item2],
});
  
  const MockRepository = () => {
    return {
      find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
      generate: jest.fn(),
    };
  };

describe("find invoice use case tests", () => {

    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);
    
        const input = {
          id: "1",
        };
    
        const result = await usecase.execute(input);
    
        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(result.id).toBe("1");
        expect(result.name).toBe("Product 1");
        expect(result.document).toBe("Description 1");
        expect(result.total).toBe(200);
        expect(result.items).toHaveLength(2);
        expect(result.items[0].name).toBe("Item 1");
        expect(result.items[0].price).toBe(100);
        expect(result.items[1].name).toBe("Item 2");
        expect(result.items[1].price).toBe(100);
        expect(result.address.street).toBe("Street 1");
        expect(result.address.number).toBe("Number 1");
        expect(result.address.complement).toBe("Complement 1");
        expect(result.address.city).toBe("City 1");
        expect(result.address.state).toBe("State 1");
        expect(result.address.zipCode).toBe("Zip Code 1");

    });

});