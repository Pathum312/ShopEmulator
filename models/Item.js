class Item {
    constructor(itemId, itemName, itemPrice, itemQuantity, ownerID) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.itemQuantity = itemQuantity;
        this.ownerId = ownerID;
    }

    get getItem() {
        return {
            "itemId": this.itemId,
            "itemName": this.itemName,
            "itemPrice": this.itemPrice,
            "itemQuantity": this.itemQuantity,
            "ownerId": this.ownerId
        };
    }

    get getId() {
        return this.itemId;
    }

    set setId(itemId) {
        this.itemId = itemId;
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

    get getOwnerId() {
        return this.ownerId;
    }

    set setOwnerId(ownerId) {
        this.ownerId = ownerId;
    }
}

module.exports = Item;