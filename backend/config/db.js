const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_URL, // Usará la nueva URL
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: { // Configuración SSL obligatoria
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);

// Prueba de conexión
sequelize.authenticate()
  .then(() => console.log("✅ ¡Conexión exitosa a PostgreSQL!"))
  .catch(err => {
    console.error("❌ Error de conexión:", err.message);
    console.log("ℹ️ Verifica que:");
    console.log("1. Tu IP esté permitida en Railway");
    console.log("2. La URL en .env sea exactamente la de DATABASE_PUBLIC_URL");
  });

module.exports = sequelize;