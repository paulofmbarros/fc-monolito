import { app, sequelize } from "../express";
import request from "supertest";


describe("Invoice E2E tests", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

    it("should generate an invoice", async () => {
        
        const input = {
            id: "1",
            name: "Product 1",
            document: "Description 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zip Code 1",
            items: [
                {
                id: "1",
                name: "Item 1",
                price: 100,
                },
                {
                id: "2",
                name: "Item 2",
                price: 100,
                },
            ],
        };

        const response = await request(app).post("/invoice").send(input);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe(input.name);
        expect(response.body.document).toBe(input.document);
        expect(response.body.street).toBe(input.street);
        expect(response.body.number).toBe(input.number);
        expect(response.body.complement).toBe(input.complement);
        expect(response.body.city).toBe(input.city);
        expect(response.body.state).toBe(input.state);
        expect(response.body.zipCode).toBe(input.zipCode);
        expect(response.body.items.length).toBe(2);
        expect(response.body.items[0].id).toBe(input.items[0].id);
        expect(response.body.items[0].name).toBe(input.items[0].name);
        expect(response.body.items[0].price).toBe(input.items[0].price);
        expect(response.body.items[1].id).toBe(input.items[1].id);
        expect(response.body.items[1].name).toBe(input.items[1].name);
        expect(response.body.items[1].price).toBe(input.items[1].price);


    
    });

    it("should find an invoice", async () => {
        const input = {
            id: "1",
            name: "Product 1",
            document: "Description 1",
            street: "Street 1",
            number: "Number 1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "Zip Code 1",
            items: [
                {
                id: "1",
                name: "Item 1",
                price: 100,
                },
                {
                id: "2",
                name: "Item 2",
                price: 100,
                },
            ],
        };

        const response = await request(app).post("/invoice").send(input);

        const response2 = await request(app).get("/invoice/"+ response.body.id);

        expect(response2.status).toBe(200);
        expect(response2.body.id).toBeDefined();
        expect(response2.body.name).toBe(input.name);
        expect(response2.body.document).toBe(input.document);
        expect(response2.body.address.street).toBe(input.street);
        expect(response2.body.address.number).toBe(input.number);
        expect(response2.body.address.complement).toBe(input.complement);
        expect(response2.body.address.city).toBe(input.city);
        expect(response2.body.address.state).toBe(input.state);
        expect(response2.body.address.zipCode).toBe(input.zipCode);
        expect(response2.body.items.length).toBe(2);
        expect(response2.body.items[0].id).toBe(input.items[0].id);
        expect(response2.body.items[0].name).toBe(input.items[0].name);
        expect(response2.body.items[0].price).toBe(input.items[0].price);
        expect(response2.body.items[1].id).toBe(input.items[1].id);
        expect(response2.body.items[1].name).toBe(input.items[1].name);
        expect(response2.body.items[1].price).toBe(input.items[1].price);
        
    });
});