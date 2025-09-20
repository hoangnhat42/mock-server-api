'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('endpoints', 'methodHttp', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'GET',
      validate: {
        isIn: [['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('endpoints', 'methodHttp');
  }
};
