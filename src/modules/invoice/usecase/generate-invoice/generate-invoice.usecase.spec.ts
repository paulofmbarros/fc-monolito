import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

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
  


describe("generate invoice use case tests", () => {

    const MockRepository = () => {
        return {
          find: jest.fn(),
          generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        };
      };

    it("should generate an invoice", async () => {
        
        const invoiceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);
    
        const input: GenerateInvoiceUseCaseInputDto = {
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
    
        const result = await usecase.execute(input);
    
        expect(invoiceRepository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined;
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items).toBeDefined;
        expect(result.total).toBeDefined;
        
     
      });

});