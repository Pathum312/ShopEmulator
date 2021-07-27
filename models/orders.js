'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Customer }) {
      this.belongsTo(Customer, { foreignKey: 'customerId'})
    }

    toJSON() {
      return {...this.get(), id: undefined, customerId: undefined }
    }

  };
  orders.init({
    orderTotal: {
      type: DataTypes.INTEGER,
      notNull: true,
      defaultValue: 0
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'orders',
    modelName: 'orders',
  });
  return orders;
};