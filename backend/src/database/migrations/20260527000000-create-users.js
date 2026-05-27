'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      maidenName: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      age: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      birthDate: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      bloodGroup: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      height: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      weight: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      eyeColor: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      hair: {
        type: Sequelize.JSON,
        allowNull: true
      },
      address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ip: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      macAddress: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      university: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      bank: {
        type: Sequelize.JSON,
        allowNull: true
      },
      company: {
        type: Sequelize.JSON,
        allowNull: true
      },
      ein: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      ssn: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      userAgent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      crypto: {
        type: Sequelize.JSON,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      salary: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
