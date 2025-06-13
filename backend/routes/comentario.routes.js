const express = require("express");
const router = express.Router();
const controller = require("../controllers/comentario.controller");

router.post("/crear", controller.crearComentario);
router.get("/servicio/:servicioId", controller.obtenerComentariosPorServicio);

module.exports = router;
