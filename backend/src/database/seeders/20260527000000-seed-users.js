'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        username: 'alice_smith',
        company: 'Google',
        role: 'Software Engineer',
        email: 'alice.smith@google.com',
        salary: 125000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'bob_johnson',
        company: 'Microsoft',
        role: 'Product Manager',
        email: 'bob.johnson@microsoft.com',
        salary: 140000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'charlie_brown',
        company: 'Apple',
        role: 'UX Designer',
        email: 'charlie.brown@apple.com',
        salary: 110000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'diana_prince',
        company: 'Amazon',
        role: 'Data Scientist',
        email: 'diana.prince@amazon.com',
        salary: 155000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'evan_wright',
        company: 'Netflix',
        role: 'DevOps Engineer',
        email: 'evan.wright@netflix.com',
        salary: 135000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
