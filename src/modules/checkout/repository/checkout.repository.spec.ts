import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import OrderModel from "./order.model";
import { Sequelize } from "sequelize-typescript";
import  ProductModel  from "./product.model";
import  ClientModel  from "./client.model";


describe("Checkout Repository tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ":memory:",
          logging: false,
          sync: { force: true },
        });
    
        await sequelize.addModels([OrderModel, ProductModel, ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save an order", async () => {
        const checkoutRepository = new CheckoutRepository();

        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id("1"),
                name: "Client 1",
                email: "asdasd",
                document: "asdasd",
                street: "asdasd",
                number: "asdasd",
                complement: "asdasd",
                city: "asdasd",
                state: "asdasd",
                zipCode: "asdasd",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            products: [
                new Product({
                    id: new Id("1"),
                    name: "item 1",
                    description: "description 1",
                    salesPrice: 10,
                }),
                new Product({
                    id: new Id("2"),
                    name: "item 2",
                    description: "description 2",
                    salesPrice: 20,
                }),
            ],
            status: "pending",
        });
        
        await checkoutRepository.addOrder(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id.id },
            include: ["client", "products"],
        });

        expect(orderModel).toBeDefined();
        expect(orderModel.id).toBe(order.id.id);
        expect(order.client.id.id).toBe(order.client.id.id);
        expect(orderModel.client.name).toBe(order.client.name);
        expect(orderModel.client.email).toBe(order.client.email);
        expect(orderModel.products.length).toBe(2);
        expect(orderModel.products[0].id).toBe(order.products[0].id.id);
        expect(orderModel.products[0].name).toBe(order.products[0].name);
        expect(orderModel.products[0].description).toBe(order.products[0].description);
        expect(orderModel.products[0].salesPrice).toBe(order.products[0].salesPrice);
        expect(orderModel.products[1].id).toBe(order.products[1].id.id);
        expect(orderModel.products[1].name).toBe(order.products[1].name);
        expect(orderModel.products[1].description).toBe(order.products[1].description);
        expect(orderModel.products[1].salesPrice).toBe(order.products[1].salesPrice);
        expect(orderModel.status).toBe(order.status);
          
})

    it("should find an order", async () => {
        const checkoutRepository = new CheckoutRepository();

        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id("1"),
                name: "Client 1",
                email: "asdasd",
                document: "asdasd",
                street: "asdasd",
                number: "asdasd",
                complement: "asdasd",
                city: "asdasd",
                state: "asdasd",
                zipCode: "asdasd",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            products: [
                new Product({
                    id: new Id("1"),
                    name: "item 1",
                    description: "description 1",
                    salesPrice: 10,
                }),
                new Product({
                    id: new Id("2"),
                    name: "item 2",
                    description: "description 2",
                    salesPrice: 20,
                }),
            ],
            status: "pending",
        });
        
        await checkoutRepository.addOrder(order);

        const result = await checkoutRepository.findOrder("1");

        expect(result).toBeDefined();
        expect(result.id.id).toBe(order.id.id);
        expect(result.client.id.id).toBe(order.client.id.id);
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.products.length).toBe(2);
        expect(result.products[0].id.id).toBe(order.products[0].id.id);
        expect(result.products[0].name).toBe(order.products[0].name);
        expect(result.products[0].description).toBe(order.products[0].description);
        expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
        expect(result.products[1].id.id).toBe(order.products[1].id.id);
        expect(result.products[1].name).toBe(order.products[1].name);
        expect(result.products[1].description).toBe(order.products[1].description);
        expect(result.products[1].salesPrice).toBe(order.products[1].salesPrice);
        expect(result.status).toBe(order.status);
          
    })
});