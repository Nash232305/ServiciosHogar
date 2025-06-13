const express = require("express");
const router = express.Router();
const controller = require("../controllers/contratacion.controller");

router.post("/crear", controller.crearContratacion);
router.get("/listar", controller.obtenerContrataciones);
router.put("/estado/:id", controller.actualizarEstado);

module.exports = router;
