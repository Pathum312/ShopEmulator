'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_items', {
      orderId: {
        type: Sequelize.INTEGER,
        isNull: false,
        allowNull: false
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      itemPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      itemQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      itemId: {
        type: Sequelize.INTEGER,
        isNull: false,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_items');
  }
};