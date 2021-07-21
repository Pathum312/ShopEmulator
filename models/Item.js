class Item {
    constructor(itemName, itemPrice, itemQuantity, ownerID) {
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemQuantity = itemQuantity;
    }

    get getItem() {
        return {
            "itemName": this.itemName,
            "itemPrice": this.itemPrice,
            "itemQuantity": this.itemQuantity,
        };
    }

    get getName() {
        return this.itemName;
    }

    set setName(itemName) {
        return this.itemName = itemName;
    }

    get getPrice() {
        return this.itemPrice;
    }

    set setPrice(itemPrice) {
        return this.itemPrice = itemPrice;
    }

    get getQuantity() {
        return this.itemQuantity;
    }

    set setQuantity(itemQuantity) {
        return this.itemQuantity = itemQuantity;
    }
}

module.exports = Item;