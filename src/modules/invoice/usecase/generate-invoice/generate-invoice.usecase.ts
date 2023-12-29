import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItem from "../../domain/invoice-items.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceRepository from "../../repository/invoice.repository";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
    private _invoiceRepository: InvoiceRepository;
    
    constructor(_invoiceRepository: InvoiceRepository) {
        this._invoiceRepository = _invoiceRepository;
    }
   async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        
    const address = new Address(
        input.street,
        input.number,
        input.complement,
        input.city,
        input.state,
        input.zipCode,
    );

    const invoiceItems = input.items.map((item) => {
        return new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
        });
    });

    const invoiceInput = new Invoice({
        address: address,
        items: invoiceItems,
        name: input.name,
        document: input.document,
    });

        const invoice = await this._invoiceRepository.generate(invoiceInput);

        return {

            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.total,
        }
    }


}
