import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app).post("/clients").send({
      id: "1",
      name: "Client",
      document: "document",
      email: "client@xpto.com",
      street: "Street",
      number: "1",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
    });
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Client");
    expect(response.body.document).toBe("document");
    expect(response.body.email).toBe("client@xpto.com");
    expect(response.body.address._street).toBe("Street");
    expect(response.body.address._number).toBe("1");
    expect(response.body.address._complement).toBe("Complement");
    expect(response.body.address._city).toBe("City");
    expect(response.body.address._state).toBe("State");
    expect(response.body.address._zipCode).toBe("ZipCode");
  });
});
