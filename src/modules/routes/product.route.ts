import express, { Request, Response } from "express";
import AddProductUseCase from "../product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../product-adm/repository/product.repository";


export const productRoute = express.Router();

productRoute.post("/", async (req:Request, res: Response) => {
    const useCase = new AddProductUseCase(new ProductRepository());
    
    try {
        const productDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        }
        const output = await useCase.execute(productDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});