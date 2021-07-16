class Owner {
    constructor(ownerId, ownerName, ownerProfit, ownerLoss) {
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.ownerProfit = ownerProfit;
        this.ownerLoss = ownerLoss;
    }

    get getId() {
        return this.ownerId;
    }

    set setId(ownerId) {
        this.ownerId = ownerId;
    }

    get getName() {
        return this.ownerName;
    }

    set setName(ownerName) {
        this.ownerName = ownerName;
    }

    get getProfit() {
        return this.ownerProfit;
    }

    set setProfit(ownerProfit) {
        this.ownerProfit = ownerProfit;
    }

    get getLoss() {
        return this.ownerLoss;
    }

    set setLoss(ownerLoss) {
        this.ownerLoss = ownerLoss;
    }
}

module.exports = Owner;