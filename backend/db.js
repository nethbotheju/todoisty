const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  username: "neth",
  password: "2005",
  database: "to-do-list-app",
  host: "127.0.0.1",
  dialect: "postgres",
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
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  reminder: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  remindertime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
});

// Sync model with the database
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Use alter to update the schema
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
}

// Export the sequelize instance and models
module.exports = { sequelize, Todo, syncDatabase };
