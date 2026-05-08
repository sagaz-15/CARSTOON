// =====================================================
// RUTAS DE MECÁNICOS
// =====================================================

const express = require('express');
const router = express.Router();
const { verificarToken, esMecanico } = require('../middleware/auth');
const { queryDB, sql, getConnection } = require('../config/database');

// MECÁNICO: VER SU PERFIL
router.get('/perfil', verificarToken, esMecanico, async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;

    const mecanicos = await queryDB(
      `SELECT m.id_mecanico, u.nombre, u.correo_electronico, u.telefono, u.ciudad,
              m.especialidad_principal, m.experiencia_anios, m.calificacion, m.disponible,
              e.nombre as especialidad
       FROM Mecanicos m
       JOIN Usuarios u ON m.id_usuario = u.id_usuario
       LEFT JOIN Especializaciones e ON m.especialidad_principal = e.id_especializacion
       WHERE m.id_usuario = @id_usuario`,
      [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
    );

    if (mecanicos.length === 0) {
      return res.status(404).json({ error: 'Perfil de mecánico no encontrado' });
    }

    res.json(mecanicos[0]);
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// MECÁNICO: ACTUALIZAR DISPONIBILIDAD
router.put('/disponibilidad', verificarToken, esMecanico, async (req, res) => {
  try {
    const { disponible } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (typeof disponible !== 'boolean') {
      return res.status(400).json({ error: 'Valor de disponibilidad inválido' });
    }

    const mecanicos = await queryDB(
      'SELECT id_mecanico FROM Mecanicos WHERE id_usuario = @id_usuario',
      [{ name: 'id_usuario', type: sql.Int, value: id_usuario }]
    );

    if (mecanicos.length === 0) {
      return res.status(404).json({ error: 'Perfil de mecánico no encontrado' });
    }

    const id_mecanico = mecanicos[0].id_mecanico;

    const connection = await getConnection();
    const request = connection.request();

    request.input('id_mecanico', sql.Int, id_mecanico);
    request.input('disponible', sql.Bit, disponible ? 1 : 0);

    await request.query('UPDATE Mecanicos SET disponible = @disponible WHERE id_mecanico = @id_mecanico');

    res.json({ 
      mensaje: 'Disponibilidad actualizada',
      disponible
    });
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
});

// OBTENER LISTA DE MECÁNICOS DISPONIBLES
router.get('/', async (req, res) => {
  try {
    const mecanicos = await queryDB(
      `SELECT m.id_mecanico, u.nombre, u.correo_electronico, u.telefono,
              m.especialidad_principal, m.experiencia_anios, m.calificacion, m.disponible,
              e.nombre as especialidad
       FROM Mecanicos m
       JOIN Usuarios u ON m.id_usuario = u.id_usuario
       LEFT JOIN Especializaciones e ON m.especialidad_principal = e.id_especializacion
       WHERE m.disponible = 1
       ORDER BY m.calificacion DESC`
    );

    res.json({
      total: mecanicos.length,
      mecanicos
    });
  } catch (error) {
    console.error('Error obteniendo mecánicos:', error);
    res.status(500).json({ error: 'Error al obtener mecánicos' });
  }
});

// OBTENER MECÁNICO POR ESPECIALIDAD
router.get('/especialidad/:id_especializacion', async (req, res) => {
  try {
    const { id_especializacion } = req.params;

    const mecanicos = await queryDB(
      `SELECT m.id_mecanico, u.nombre, u.correo_electronico, u.telefono,
              m.especialidad_principal, m.experiencia_anios, m.calificacion,
              e.nombre as especialidad
       FROM Mecanicos m
       JOIN Usuarios u ON m.id_usuario = u.id_usuario
       LEFT JOIN Especializaciones e ON m.especialidad_principal = e.id_especializacion
       WHERE m.especialidad_principal = @id AND m.disponible = 1
       ORDER BY m.calificacion DESC`,
      [{ name: 'id', type: sql.Int, value: id_especializacion }]
    );

    res.json({
      total: mecanicos.length,
      mecanicos
    });
  } catch (error) {
    console.error('Error obteniendo mecánicos por especialidad:', error);
    res.status(500).json({ error: 'Error al obtener mecánicos' });
  }
});

module.exports = router;
