require("dotenv").config();
const { Sequelize } = require("sequelize");

// Leemos la URL de conexión desde las variables de entorno
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
