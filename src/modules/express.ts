import  ProductModel  from './product-adm/repository/product.model';
import  InvoiceModel  from './invoice/repository/invoice.model';
import  ClientModel  from './client-adm/repository/client.model';
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import TransactionModel from './payment/repository/transaction.model';
import { productRoute } from './routes/product.route';
import { clientRoute } from './routes/client.route';
import { invoiceRoute } from './routes/invoice.route';
import  InvoiceItemModel  from './invoice/repository/invoice-item.model';
import { checkoutRoute } from './routes/checkout.route';
import OrderModel from './checkout/repository/order.model';
import { default as AdmProductModel } from "./product-adm/repository/product.model";
import { default as OrderClientModel } from "./checkout/repository/client.model";
import { default as StoreProductModel } from "./store-catalog/repository/product.model";


export const app: Express = express();
app.use(express.json());
app.use("/client", clientRoute);
app.use("/product", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;

  async function setupDb() {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });
    await sequelize.addModels([ClientModel, ProductModel, InvoiceModel, InvoiceItemModel, OrderModel, OrderClientModel, TransactionModel, AdmProductModel, StoreProductModel]);
  
    await sequelize.sync();
  }
  setupDb();
