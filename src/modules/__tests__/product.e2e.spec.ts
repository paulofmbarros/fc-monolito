import { app, sequelize } from "../express";
import request from "supertest";
describe("Product E2E tests", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

    it("should create a product", async () => {
        
        const input = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            purchasePrice: 100,
            stock: 10,
        };

        const response = await request(app).post("/product").send(input);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(input.id);
        expect(response.body.name).toBe(input.name);
    
    });
});