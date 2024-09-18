module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Todos", "date", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.addColumn("Todos", "time", {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Todos", "date");
    await queryInterface.removeColumn("Todos", "time");
  },
};
