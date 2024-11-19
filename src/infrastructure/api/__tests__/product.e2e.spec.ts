import { Sequelize } from "sequelize-typescript"
import { app } from "../../express";
import request from 'supertest'
import { migrator } from "../../db/config-migrations/migrator"
import { Umzug } from "umzug"
import { ProductModel } from "../../../domain/product-adm/repository/product.model"

describe("E2E test for product", () => {
    
    let sequelize: Sequelize

    let migration: Umzug<any>;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false
      })
      
      sequelize.addModels([ProductModel])
      migration = migrator(sequelize)
      await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
          return 
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
      })
    
    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product",
                description: "Description",
                purchasePrice: 100,
                stock: 100
            });
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("Product");
        expect(response.body.description).toBe("Description");
        expect(response.body.purchasePrice).toBe(100);
        expect(response.body.stock).toBe(100);
    });
});   