const Contratacion = require("../models/Contratacion");

exports.crearContratacion = async (req, res) => {
  try {
    const { clienteId, servicioId, fecha } = req.body;

    if (!clienteId || !servicioId || !fecha) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const nueva = await Contratacion.create({ clienteId, servicioId, fecha });
    res
      .status(201)
      .json({ mensaje: "Contratación registrada", contratacion: nueva });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerContrataciones = async (req, res) => {
  try {
    const todas = await Contratacion.findAll();
    res.json(todas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validos = ["pendiente", "aceptada", "rechazada", "completada"];
    if (!validos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido." });
    }

    const contratacion = await Contratacion.findByPk(id);
    if (!contratacion) {
      return res.status(404).json({ error: "Contratación no encontrada." });
    }

    contratacion.estado = estado;
    await contratacion.save();

    res.json({ mensaje: "Estado actualizado", contratacion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
