const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Comentario = sequelize.define("Comentario", {
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  servicioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  calificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = Comentario;
