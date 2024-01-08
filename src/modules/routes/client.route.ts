import ClientRepository from "../client-adm/repository/client.repository";
import AddClientUseCase from "../client-adm/usecase/add-client/add-client.usecase";
import express, { Request, Response } from "express";


export const clientRoute = express.Router();

clientRoute.post("/", async (req:Request, res: Response) => {
    const useCase = new AddClientUseCase(new ClientRepository());
    
    try {

        const clientDto = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            document: req.body.document
        }
        
        const output = await useCase.execute(clientDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});