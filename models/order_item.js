'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ orders, Item }) {
      this.belongsTo(orders, { foreignKey: 'orderId' });
      this.belongsTo(Item, { foreignKey: 'itemId' });
    }

    toJSON() {
      return {...this.get(), id: undefined, orderId: undefined, itemId: undefined }
    }

  };
  order_item.init({
    itemName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'order_item',
    modelName: 'order_item',
  });
  return order_item;
};