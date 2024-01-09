import express, { Request, Response } from "express";
import PlaceOrderUseCase from "../checkout/usecase/place-order/place-order.usecase";
import ProductAdmFacade from "../product-adm/facade/product-adm.facade";
import ProductAdmFacadeFactory from "../product-adm/factory/facade.factory";
import ClientAdmFacadeFactory from "../client-adm/factory/client-adm.facade.factory";
import StoreCatalogFacadeFactory from "../store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "../invoice/factory/facade.factory";
import PaymentFacadeFactory from "../payment/factory/payment.facade.factory";
import CheckoutRepository from "../checkout/repository/checkout.repository";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req:Request, res: Response) => {
    const productFacade = ProductAdmFacadeFactory.create();
    const clientFacade = ClientAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const checkoutRepostiory = new CheckoutRepository();
    
    
    const useCase = new PlaceOrderUseCase(clientFacade, productFacade, catalogFacade, checkoutRepostiory, invoiceFacade, paymentFacade);
    
    try {
        const clientDto = {
            clientId: req.body.clientId,
            products: req.body.products
        }
        
        const output = await useCase.execute(clientDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});