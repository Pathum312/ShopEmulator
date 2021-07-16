class Order {
    constructor(orderId, orderItems, orderTotal, customerId, ownerId) {
        this.orderId = orderId;
        this.orderItems = orderItems;
        this.orderTotal = orderTotal;
        this.customerId = customerId;
        this.ownerId = ownerId;
    }
}

module.exports = Order;