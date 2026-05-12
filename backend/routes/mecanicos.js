const express = require('express')
const router = express.Router()
const { sql } = require('../db')

// GET /api/mecanicos - Listar mecánicos disponibles
// Query params: especialidad, disponible, calificacion_min
router.get('/', async (req, res) => {
    try {
        const { especialidad, disponible, calificacion_min } = req.query

        let query = `
            SELECT 
                m.id_mecanico,
                u.nombre,
                u.correo_electronico,
                u.telefono,
                u.ciudad,
                e.nombre AS especialidad,
                m.experiencia_anios,
                m.calificacion,
                m.disponible
            FROM Mecanicos m
            INNER JOIN Usuarios u ON m.id_usuario = u.id_usuario
            LEFT JOIN Especializaciones e ON m.especialidad_principal = e.id_especializacion
            WHERE 1=1
        `

        const request = new sql.Request()

        if (especialidad) {
            query += ` AND e.nombre LIKE @especialidad`
            request.input('especialidad', sql.VarChar, `%${especialidad}%`)
        }

        if (disponible !== 'todos') {
            query += ` AND m.disponible = 1`
        }

        if (calificacion_min) {
            query += ` AND m.calificacion >= @calificacion_min`
            request.input('calificacion_min', sql.Decimal(3, 2), parseFloat(calificacion_min))
        }

        query += ` ORDER BY m.calificacion DESC, m.experiencia_anios DESC`

        const result = await request.query(query)

        res.json({
            total: result.recordset.length,
            mecanicos: result.recordset
        })
    } catch (err) {
        console.error('Error al buscar mecánicos:', err)
        res.status(500).json({ error: 'Error al obtener mecánicos', detalle: err.message })
    }
})

// GET /api/mecanicos/:id - Ver mecánico con sus servicios
router.get('/:id', async (req, res) => {
    try {
        const request = new sql.Request()
        request.input('id', sql.Int, parseInt(req.params.id))

        const mecanicoResult = await request.query(`
            SELECT 
                m.id_mecanico,
                u.nombre,
                u.correo_electronico,
                u.telefono,
                u.ciudad,
                e.nombre AS especialidad,
                m.experiencia_anios,
                m.calificacion,
                m.disponible
            FROM Mecanicos m
            INNER JOIN Usuarios u ON m.id_usuario = u.id_usuario
            LEFT JOIN Especializaciones e ON m.especialidad_principal = e.id_especializacion
            WHERE m.id_mecanico = @id
        `)

        if (mecanicoResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Mecánico no encontrado' })
        }

        // Servicios del mecánico según su especialidad
        const request2 = new sql.Request()
        request2.input('id', sql.Int, parseInt(req.params.id))

        const serviciosResult = await request2.query(`
            SELECT s.nombre, s.costo, s.tiempo_estimado
            FROM Servicios s
            INNER JOIN Mecanicos m ON s.id_especializacion = m.especialidad_principal
            WHERE m.id_mecanico = @id AND s.activo = 1
        `)

        res.json({
            mecanico: mecanicoResult.recordset[0],
            servicios_disponibles: serviciosResult.recordset
        })
    } catch (err) {
        console.error('Error al obtener mecánico:', err)
        res.status(500).json({ error: 'Error al obtener mecánico', detalle: err.message })
    }
})

module.exports = router
