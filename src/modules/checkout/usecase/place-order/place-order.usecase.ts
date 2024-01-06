import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import CatalogAdmFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import ChekcoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {

    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: CatalogAdmFacadeInterface;
    private _repository: ChekcoutGateway;
    private _invoiceFacade: InvoiceFacadeInterface;
    private _paymentFacade: PaymentFacadeInterface;

    constructor(clientFacade: ClientAdmFacadeInterface,
         productFacade: ProductAdmFacadeInterface,
        catalogFacade: CatalogAdmFacadeInterface,
        repository: ChekcoutGateway,
        invoiceFacade: InvoiceFacadeInterface,
        paymentFacade: PaymentFacadeInterface
         ) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._repository = repository;
        this._invoiceFacade = invoiceFacade;
        this._paymentFacade = paymentFacade;

    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        
        const client = await this._clientFacade.find({id: input.clientId});
        if (!client) {
            throw new Error("Client not found");
        }

        await this.validateProducts(input);

        const products = await Promise.all(
            input.products.map((p)=> this.getProduct(p.productId))
        );

        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address !== undefined ? client.address.street : ""
        });

        const order = new Order({
            client: myClient,
            products: products,
        })

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total
        });

        const invoice = payment.status === 'approved' ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.address !== undefined ? client.address.street : "",
            number: client.address !== undefined ? client.address.number : "",
            complement: client.address !== undefined ? client.address.complement : "",
            city: client.address !== undefined ? client.address.city : "",
            state: client.address !== undefined ? client.address.state : "",
            zipCode: client.address !== undefined ? client.address.zipCode : "",
            items: order.products.map((p)=> ({
                id: p.id.id,
                name: p.name,
                price: p.salesPrice
            }))
        }) : null;

        payment.status === 'approved' && order.approved();
        this._repository.addOrder(order);

        
    
    
        return {
            id: order.id.id,
            invoiceId:payment.status === 'approved' ? invoice.id : null,
            products: order.products.map((p)=> ({
                productId: p.id.id
            })),
            status: order.status,
            total: order.total
        }
    }
    private async validateProducts(input: PlaceOrderInputDto) {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({productId: p.productId});
           
            if (product.stock <= 0) {
                throw new Error(`Product ${product.productId} is not available in stock`);
            }
        }
    }

    private async getProduct(productId: string):Promise<Product>  {
        const product = await this._catalogFacade.find({id: productId});
        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }
        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        }

        return new Product(productProps);   
    }
}