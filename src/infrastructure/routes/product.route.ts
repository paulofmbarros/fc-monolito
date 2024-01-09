import express, { Request, Response } from "express";
import ProductAdmAddProductUseCase  from "../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductRepository from "../../modules/product-adm/repository/product.repository";


export const productRoute = express.Router();

productRoute.post("/", async (req:Request, res: Response) => {
    const useCase = new ProductAdmAddProductUseCase (new ProductRepository());
    
    try {
        const productDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.price,
            stock: req.body.stock,
        }
        const output = await useCase.execute(productDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});