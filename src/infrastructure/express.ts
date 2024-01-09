import  ProductModel  from '../modules/product-adm/repository/product.model';
import  InvoiceModel  from '../modules/invoice/repository/invoice.model';
import  ClientModel  from '../modules/client-adm/repository/client.model';
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import TransactionModel from '../modules/payment/repository/transaction.model';
import { productRoute } from './routes/product.route';
import { clientRoute } from './routes/client.route';
import { invoiceRoute } from './routes/invoice.route';
import  InvoiceItemModel  from '../modules/invoice/repository/invoice-item.model';
import { checkoutRoute } from './routes/checkout.route';
import OrderModel from '../modules/checkout/repository/order.model';
import { default as AdmProductModel } from "../modules/product-adm/repository/product.model";
import { default as OrderClientModel } from "../modules/checkout/repository/client.model";
import { default as StoreProductModel } from "../modules/store-catalog/repository/product.model";


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
    await sequelize.addModels([OrderModel,
      ClientModel,
      OrderClientModel,
      TransactionModel,
      StoreProductModel,
      InvoiceItemModel,
      InvoiceModel,
      ProductModel,
      AdmProductModel]);
  
    await sequelize.sync();
  }
  setupDb();
