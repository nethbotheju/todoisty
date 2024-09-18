const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define the Todo model
const Todo = sequelize.define("Todo", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  date: {
    type: DataTypes.DATEONLY, // Only store the date (YYYY-MM-DD)
    allowNull: false, // Ensure a date is provided
  },
  time: {
    type: DataTypes.TIME, // Store only the time (HH:MM:SS)
    allowNull: true, // Time can be optional (null)
  },
});

// Sync model with the database
sequelize.sync();

module.exports = { sequelize, Todo };
