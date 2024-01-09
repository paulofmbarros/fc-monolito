
import { app, sequelize } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import  InvoiceModel  from "../invoice/repository/invoice.model";
import  ProductModel  from "../checkout/repository/product.model";
import OrderModel from "../checkout/repository/order.model";
import  ClientModel  from "../client-adm/repository/client.model";
import InvoiceItemModel from '../invoice/repository/invoice-item.model';
import { default as OrderClientModel } from "../checkout/repository/client.model";
import TransactionModel from "../payment/repository/transaction.model";
import { default as AdmProductModel } from "../product-adm/repository/product.model";
import { default as StoreProductModel } from "../store-catalog/repository/product.model";
import Id from "../@shared/domain/value-object/id.value-object";
import * as CheckStockUseCase from "../product-adm/usecase/check-stock/check-stock.usecase";
import * as GenerateInvoiceUseCase from "../invoice/usecase/generate-invoice/generate-invoice.usecase";
import * as CheckoutRepository from "../checkout/repository/checkout.repository";


describe("Checkout E2E tests", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
          });
      
          sequelize.addModels([OrderModel,
            ClientModel,
            OrderClientModel,
            TransactionModel,
            StoreProductModel,
            InvoiceItemModel,
            InvoiceModel,
            ProductModel,
            AdmProductModel]);
      
          await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

      it("should create a placeorder", async () => {
        const invoiceId = new Id()
        // @ts-ignore
        jest.spyOn(CheckStockUseCase, 'default').mockImplementation(() => ({
          execute: jest.fn(({ productId }: { productId: string }) =>
            Promise.resolve({
              productId,
              stock: 10,
            })
          ),
        }))
        jest.spyOn(GenerateInvoiceUseCase, 'default').mockImplementation(() => ({
          // @ts-ignore
          execute: jest.fn((invoice) => Promise.resolve({ id: invoiceId })),
        }))
    
        jest.spyOn(CheckoutRepository, 'default').mockImplementation(() => ({
          // @ts-ignore
          addOrder: jest.fn((order) => Promise.resolve({
            id: new Id(),
            status: "approved",
            total: 100,
            products: [{
              productId: new Id(),
            }]
          })),
        }))
    
        await ClientModel.create({
          id: "1",
          name: "test",
          email: "test@test.com",
          document: "123456789",
          street: "16 avenue",
          number: "123",
          complement: "Ap 400",
          city: "My city",
          state: "State",
          zipcode: "89777310",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    
        await StoreProductModel.create({
          id: "1",
          name: "test",
          description: "test",
          stock: 10,
          salesPrice: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    
        const response = await request(app)
          .post("/checkout")
          .send({
            clientId: "1",
            products: [{ productId: "1" }],
          });
    
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined()
        expect(response.body.invoiceId).toBeDefined()
        expect(response.body.status).toBe("approved")
        expect(response.body.total).toBe(100)
        expect(response.body.products.length).toBe(1)
        expect(response.body.products[0].productId).toBe("1")
      });
})