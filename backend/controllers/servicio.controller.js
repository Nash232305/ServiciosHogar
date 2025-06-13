const Servicio = require("../models/Servicio");

// Crear un nuevo servicio
exports.crearServicio = async (req, res) => {
  try {
    const { titulo, descripcion, precio, categoria, proveedorId } = req.body;

    if (!titulo || titulo.trim() === "") {
      return res.status(400).json({ error: "El título es obligatorio." });
    }
    if (!descripcion || descripcion.length < 10) {
      return res
        .status(400)
        .json({ error: "La descripción debe tener al menos 10 caracteres." });
    }
    if (!precio || isNaN(precio) || precio <= 0) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número mayor que 0." });
    }
    if (!categoria || categoria.trim() === "") {
      return res.status(400).json({ error: "La categoría es obligatoria." });
    }
    if (!proveedorId || isNaN(proveedorId)) {
      return res
        .status(400)
        .json({ error: "El ID del proveedor debe ser un número." });
    }

    const imagen = req.file ? req.file.filename : null;

    const nuevo = await Servicio.create({
      titulo,
      descripcion,
      precio,
      categoria,
      proveedorId,
      imagen,
    });

    res
      .status(201)
      .json({ mensaje: "Servicio creado con imagen", servicio: nuevo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los servicios
exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar un servicio existente
exports.editarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, precio, categoria } = req.body;

    if (!titulo || titulo.trim() === "") {
      return res.status(400).json({ error: "El título es obligatorio." });
    }
    if (!descripcion || descripcion.length < 10) {
      return res
        .status(400)
        .json({ error: "La descripción debe tener al menos 10 caracteres." });
    }
    if (!precio || isNaN(precio) || precio <= 0) {
      return res
        .status(400)
        .json({ error: "El precio debe ser un número mayor que 0." });
    }
    if (!categoria || categoria.trim() === "") {
      return res.status(400).json({ error: "La categoría es obligatoria." });
    }

    // Buscar servicio por ID
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado." });
    }

    // Actualizar campos
    servicio.titulo = titulo;
    servicio.descripcion = descripcion;
    servicio.precio = precio;
    servicio.categoria = categoria;

    // Si se subió imagen nueva, actualízala
    if (req.file) {
      servicio.imagen = req.file.filename;
    }

    await servicio.save();

    res.json({ mensaje: "Servicio actualizado", servicio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un servicio
exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado." });
    }
    await servicio.destroy();
    res.json({ mensaje: "Servicio eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
