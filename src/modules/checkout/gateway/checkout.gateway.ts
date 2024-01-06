import Order from "../domain/order.entity";

export default interface ChekcoutGateway {
    addOrder(order: Order): Promise<void>;
    findOrder(id:string): Promise<Order|null>;
}