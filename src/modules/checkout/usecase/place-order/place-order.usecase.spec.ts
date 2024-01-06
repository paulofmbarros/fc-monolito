import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";

const mockDate = new Date("2021-01-01T00:00:00.000Z");

describe ("PlaceOrderUseCase unit test", () => {

    describe("ValidateProducts method", () => {
        //@ts-expected-error -> no params in the constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when no products are selected", async() => {
            const input: PlaceOrderInputDto = {
                clientId: "1",
                products:[]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
            .rejects.toThrow(new Error("No products selected"));
        });

        it("it should throw an error when product is out of stock", async() => {
            const mockProductFacade = {
                checkStock : jest.fn(({productId}: {productId:string}) => 
                Promise.resolve({
                    productId,
                    stock: productId === "1" ? 0 : 1
                })
            ),
         }

            //@ts-expect-error -> force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input : PlaceOrderInputDto = {
                clientId: "0",
                products: [
                    {productId: "1"}
                ]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("Product 1 is not available in stock"));

            input = {
                clientId: "0",
                products: [
                    {productId: "0"},
                    {productId: "1"}
                ]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("Product 1 is not available in stock"));

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [
                    {productId: "0"},
                    {productId: "1"},
                    {productId: "2"},
                ]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("Product 1 is not available in stock"));

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);

        });

        it("should return a product", async() => {
            const mockCatalogFacade = {
                find : jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    salesPrice: 0,
                    description: "Product 0 description",
            })};

            //@ts-expect-error -> force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description : "Product 0 description",
                    salesPrice: 0
                }));
                
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);


        });

        

    });


    describe("get products method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

         //@ts-expected-error -> no params in the constructor
         const placeOrderUseCase = new PlaceOrderUseCase();

         it("should thorw an error when products not found", async() => {
            const mockCatalogFacade = {
                find : jest.fn().mockResolvedValue(null)
            };

            //@ts-expect-error -> force set productFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(new Error("Product 0 not found"));

         });

    });

    describe ("execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it ("should throw an error if client not found", async() => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            //@ts-expected-error -> no params in the constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            //@ts-expect-error -> force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products:[]
            };

            await expect(placeOrderUseCase.execute(input))
            .rejects.toThrow( new Error("Client not found"));
        });

        it("should throw an  error when  products are not found", async() => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            }

            //@ts-expected-error -> no params in the constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = 
            jest
            //@ts-expect-error -> spy on a private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error -> not retun never
            .mockRejectedValue(new Error("No products selected"));


            //@ts-expect-error -> force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products:[]
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("No products selected"));


        });

        describe("place an order", () => {
            const clientProps = {
                id: "1",
                name: "Client 1",
                document: "00000000000",
                email: "adjkas@ajkshd.com",
                street : "Street 1",
                number: "1",
                complement: "Complement 1",
                city: "City 1",
                state : "State 1",
                zipCode: "ZipCode 1"
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps)
            }

            const mockPaymentFacade = {
                process: jest.fn()
            }

            const mockCheckoutRepo = {
                addOrder : jest.fn()
            }

            const mockInvoiceFacade ={
                generate : jest.fn().mockResolvedValue({id: "1i"}),
            }

            const products = {
                "1" : new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 1
                }),
                "2" : new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Product 2 description",
                    salesPrice: 2
                })
            }

            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade as any, null, null, 
                mockCheckoutRepo as any,
                mockInvoiceFacade as any, 
                mockPaymentFacade as any
                )


            const mockValidateProducts = jest
            //@ts-expect-error -> spy  on a private method
            .spyOn(placeOrderUseCase, "validateProducts") 
             //@ts-expect-error -> spy  on a private method
             .mockResolvedValue(null);

             const mockGetProduct = jest
                //@ts-expect-error -> spy  on a private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error -> spy  on a private method
                .mockImplementation((productId: keyof typeof products)=> {
                    return products[productId]|| null;
                })

                it("should not be approved", async() => {
                    mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                        transactionId: "1",
                        orderId: "1o",
                        amount: 100,
                        status: "error",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    
                    const input: PlaceOrderInputDto = {
                        clientId: "1",
                        products: [
                            {productId: "1"},
                            {productId: "2"}
                        ]
                    }

                    let output = await placeOrderUseCase.execute(input);

                    expect(output.invoiceId).toBeNull();
                    expect(output.total).toBe(3);
                    expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
                    expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                    expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1"});
                    expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                    expect(mockValidateProducts).toHaveBeenCalledWith(input);
                    expect(mockGetProduct).toHaveBeenCalledTimes(2);
                    expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                    expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                    expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                        orderId: output.id,
                        amount: output.total,

                    });

                    expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
                })

                it("should be approved", async() => {
                    mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue({
                        transactionId: "1",
                        orderId: "1o",
                        amount: 100,
                        status: "approved",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });

                    const input: PlaceOrderInputDto = {
                        clientId: "1c",
                        products: [
                            {productId: "1"},
                            {productId: "2"}
                        ]
                    }
                    let output = await placeOrderUseCase.execute(input);

                    expect(output.invoiceId).toBe("1i");
                    expect(output.total).toBe(3);
                    expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
                    expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                    expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
                     expect(mockGetProduct).toHaveBeenCalledTimes(2);
                    expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                    expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                    expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                        orderId: output.id,
                        amount: output.total,

                    });
                    expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                    expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                        name: clientProps.name,
                        document: clientProps.document,
                        street: "",
                        number: "",
                        complement: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        items: [
                            {
                                id: "1",
                                name: "Product 1",
                                price: 1
                            },
                            {
                                id: "2",
                                name: "Product 2",
                                price: 2
                            }
                        ]


                    });
                });


        });


    })
});