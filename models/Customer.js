class Customer {
    constructor(customerId, customerName, customerEmail) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
    }

    get getId() {
        return this.customerId;
    }

    set setId(customerId) {
        this.customerId = customerId;
    }

    get getName() {
        return this.customerName;
    }

    set setName(customerName) {
        this.customerName = customerName;
    }

    get getEmail() {
        return this.customerEmail;
    }

    set setEmail(customerEmail) {
        this.customerEmail = customerEmail;
    }
}

module.exports = Customer;