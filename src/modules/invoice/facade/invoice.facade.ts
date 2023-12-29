import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceRepository from "../repository/invoice.repository";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDTO, GenerateInvoiceFacadeOutputDTO } from "./invoice.facade.interface";


export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _generateInvoiceUseCase: UseCaseInterface;
    private _findInvoiceUseCase: UseCaseInterface;

    constructor(generateInvoiceUseCase: UseCaseInterface, findInvoiceUseCase: UseCaseInterface) {
        this._generateInvoiceUseCase = generateInvoiceUseCase;
        this._findInvoiceUseCase = findInvoiceUseCase;
    }

    find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return this._findInvoiceUseCase.execute(input);
    }
    generate(input: GenerateInvoiceFacadeInputDTO): Promise<GenerateInvoiceFacadeOutputDTO> {
         return this._generateInvoiceUseCase.execute(input);
    }

}