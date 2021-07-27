'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Orders }) {
      // this.hasMany(Orders, { foreignKey: 'customerId'})
    }

    toJSON() {
      return {...this.get(), id: undefined }
    }

  };
  Customer.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {Error: "customerName cannot be null"},
        notEmpty: {Error: "customerEmail cannot be empty"}
      }
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {Error: "customerName cannot be null"},
        notEmpty: {Error: "customerEmail cannot be empty"},
        isEmail: {Error: "Please enter a valid email"}
      }
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'customers',
    modelName: 'Customer',
  });
  return Customer;
};