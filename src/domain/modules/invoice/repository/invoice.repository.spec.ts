import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item.entity";

describe("Invoice repository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "invoice name",
      document: "invoice document",
      address: new Address(
        "invoice street",
        "100",
        "invoice complement",
        "invoice city",
        "invoice state",
        "invoice zipCode",
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "invoice item name",
          price: 10,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "invoice item name 2",
          price: 20,
        }),
      ],
    });

    const invoiceRepository = new InvoiceRepository();

    const result = await invoiceRepository.generate(invoice);

    expect(result.id.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);

    expect(result.items.length).toBe(2);

    expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);

    expect(result.items[1].id.id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);

    expect(result.total).toBe(30);
  });

  it("should find a invoice", async () => {
    const invoiceCreated = await InvoiceModel.create(
      {
        id: "1",
        name: "invoice name",
        document: "invoice document",
        street: "invoice street",
        number: "100",
        complement: "invoice complement",
        city: "invoice city",
        state: "invoice state",
        zipCode: "invoice zipCode",
        items: [
          {
            id: "1",
            name: "invoice item name",
            price: 10,
            invoice_id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "invoice item name 2",
            price: 20,
            invoice_id: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [{ model: InvoiceItemModel }] }
    );

    const invoiceRepository = new InvoiceRepository();
    const invoice = await invoiceRepository.find("1");

    expect(invoice.id.id).toBe(invoiceCreated.id);
    expect(invoice.name).toBe(invoiceCreated.name);
    expect(invoice.document).toBe(invoiceCreated.document);
    expect(invoice.address.street).toBe(invoiceCreated.street);
    expect(invoice.address.number).toBe(invoiceCreated.number);
    expect(invoice.address.complement).toBe(invoiceCreated.complement);
    expect(invoice.address.city).toBe(invoiceCreated.city);
    expect(invoice.address.state).toBe(invoiceCreated.state);
    expect(invoice.address.zipCode).toBe(invoiceCreated.zipCode);

    expect(invoice.items.length).toBe(2);

    expect(invoice.items[0].id.id).toBe(invoiceCreated.items[0].id);
    expect(invoice.items[0].name).toBe(invoiceCreated.items[0].name);
    expect(invoice.items[0].price).toBe(invoiceCreated.items[0].price);
    
    expect(invoice.items[1].id.id).toBe(invoiceCreated.items[1].id);
    expect(invoice.items[1].name).toBe(invoiceCreated.items[1].name);
    expect(invoice.items[1].price).toBe(invoiceCreated.items[1].price);
  });
});
