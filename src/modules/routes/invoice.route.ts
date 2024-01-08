import InvoiceRepository from "../invoice/repository/invoice.repository";
import FindInvoiceUseCase from "../invoice/usecase/find-invoice/find-invoice.usecase";
import express, { Request, Response } from "express";


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