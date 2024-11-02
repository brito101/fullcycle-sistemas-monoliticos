import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";

import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate invoice usecase unit test", () => {
  it("should generate an invoice", async () => {
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
        "invoice zipCode"
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

    const MockRepository = () => {
      return {
        generate: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        find: jest.fn(),
      };
    };

    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input = {
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
        },
        {
          id: "2",
          name: "invoice item name 2",
          price: 20,
        },
      ],
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();

    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.zipCode).toBe(invoice.address.zipCode);

    expect(result.items.length).toBe(2);

    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);

    expect(result.items[1].id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);

    expect(result.total).toBe(30);
  });
});
