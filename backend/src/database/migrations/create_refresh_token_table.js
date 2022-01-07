'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refreshtokens', {
      id: {
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: true,
        // This is important for making sure that ignoreDuplicates works correctly
        unique: true
      },
      athleteId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      readScope: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      readAllScope: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refreshtokens');
  }
};
