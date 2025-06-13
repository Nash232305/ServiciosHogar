const Comentario = require("../models/Comentario");

exports.crearComentario = async (req, res) => {
  try {
    const { clienteId, servicioId, comentario, calificacion } = req.body;

    if (!comentario || comentario.trim().length < 5) {
      return res
        .status(400)
        .json({ error: "El comentario debe tener al menos 5 caracteres." });
    }

    if (
      !calificacion ||
      isNaN(calificacion) ||
      calificacion < 1 ||
      calificacion > 5
    ) {
      return res
        .status(400)
        .json({ error: "La calificación debe ser un número entre 1 y 5." });
    }

    const nuevo = await Comentario.create({
      clienteId,
      servicioId,
      comentario,
      calificacion,
    });
    res.status(201).json({ mensaje: "Comentario guardado", comentario: nuevo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.obtenerComentariosPorServicio = async (req, res) => {
  try {
    const { servicioId } = req.params;
    const comentarios = await Comentario.findAll({ where: { servicioId } });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
