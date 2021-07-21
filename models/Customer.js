class Customer {
    constructor(customerName, customerEmail) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
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