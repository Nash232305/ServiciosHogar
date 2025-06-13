require("dotenv").config();
const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 4000;

console.log("🌐 Iniciando conexión a la base de datos...");

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexión a la base de datos exitosa.");
    return sequelize.sync(); // o { alter: true } para desarrollo
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
  });
