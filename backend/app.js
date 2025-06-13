const express = require("express");
const cors = require("cors");
const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Servir archivos de imagen
app.use("/uploads", express.static("uploads"));

// Rutas
const authRoutes = require("./routes/auth.routes.js");
app.use("/api/auth", authRoutes);

const servicioRoutes = require("./routes/servicio.routes.js");
app.use("/api/servicios", servicioRoutes);

const contratacionRoutes = require("./routes/contratacion.routes.js");
app.use("/api/contrataciones", contratacionRoutes);

const comentarioRoutes = require("./routes/comentario.routes.js");
app.use("/api/comentarios", comentarioRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

module.exports = app;
