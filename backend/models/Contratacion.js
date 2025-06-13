const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Contratacion = sequelize.define("Contratacion", {
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  servicioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "aceptada", "rechazada", "completada"),
    defaultValue: "pendiente",
  },
});

module.exports = Contratacion;
