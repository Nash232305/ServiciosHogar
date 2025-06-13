const express = require("express");
const router = express.Router();
const servicioController = require("../controllers/servicio.controller");
const upload = require("../middleware/multer");

router.post(
  "/crear",
  upload.single("imagen"),
  servicioController.crearServicio
);
router.get("/listar", servicioController.obtenerServicios);
router.put("/:id", upload.single("imagen"), servicioController.editarServicio);
router.delete("/:id", servicioController.eliminarServicio);
module.exports = router;
