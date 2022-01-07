'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accesstokens', {
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
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      readScope: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      readAllScope: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('accesstokens');
  }
};
