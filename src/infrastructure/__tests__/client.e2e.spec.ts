import { app, sequelize } from "../express";
import request from "supertest";

describe("Client E2E tests", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

    it("should create a client", async () => {
        
        const input = {
            id: "1",
            name: "Client 1",
            email: "asdasd",
            phone: "asdasd",
            address: {
                street: "asdasd",
                number: "asdasd",
                complement: "asdasd",
                city: "asdasd",
                state: "asdasd",
                zipCode: "asdasd",
            
            },
            document: "asdasdas"
        };

        const response = await request(app).post("/client").send(input);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(input.id);
        expect(response.body.name).toBe(input.name);
    
    });
});