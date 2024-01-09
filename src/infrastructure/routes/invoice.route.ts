import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";
import FindInvoiceUseCase from "../../modules/invoice/usecase/find-invoice/find-invoice.usecase";
import express, { Request, Response } from "express";
import GenerateInvoiceUseCase from "../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";


export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req:Request<{id: string}>, res: Response) => {
    const useCase = new FindInvoiceUseCase(new InvoiceRepository());
    
    try {
        const invoiceDto = {
            id: req.params.id
        }
        const output = await useCase.execute(invoiceDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

invoiceRoute.post("/", async (req:Request, res: Response) => {
    const useCase = new GenerateInvoiceUseCase(new InvoiceRepository());
    
    try {
        const invoiceDto = {
            name: req.body.name,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            items: req.body.items,
        }
        const output = await useCase.execute(invoiceDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});