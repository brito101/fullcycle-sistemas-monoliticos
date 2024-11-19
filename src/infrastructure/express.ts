import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../domain/client-adm/repository/client.model";
import { ProductModel } from "../domain/product-adm/repository/product.model";
import { clientRoute } from "./api/routes/client.route";
import { productRoute } from "./api/routes/product.route";
import { invoiceRoute } from "./api/routes/invoice.route";
import { checkoutRoute } from "./api/routes/checkout.route";
import TransactionModel from "../domain/payment/repository/transaction.model";
import { InvoiceModel } from "../domain/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../domain/invoice/repository/item.model";

export const app: Express = express();
app.use(express.json());
app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/invoice", invoiceRoute);
app.use("/checkout", checkoutRoute)

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([ClientModel, ProductModel, TransactionModel, InvoiceModel, InvoiceItemModel]);
  await sequelize.sync();
}
setupDb();
