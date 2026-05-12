const express = require('express')
const router = express.Router()
const { sql } = require('../db')

// GET /api/servicios - Listar todos los servicios activos
// Query params: nombre, costo_max, especializacion
router.get('/', async (req, res) => {
    try {
        const { nombre, costo_max, especializacion } = req.query

        let query = `
            SELECT 
                s.id_servicio,
                s.nombre,
                s.descripcion,
                s.costo,
                s.tiempo_estimado,
                s.activo,
                e.nombre AS especializacion
            FROM Servicios s
            LEFT JOIN Especializaciones e ON s.id_especializacion = e.id_especializacion
            WHERE s.activo = 1
        `

        const request = new sql.Request()

        if (nombre) {
            query += ` AND s.nombre LIKE @nombre`
            request.input('nombre', sql.VarChar, `%${nombre}%`)
        }

        if (costo_max) {
            query += ` AND s.costo <= @costo_max`
            request.input('costo_max', sql.Decimal(10, 2), parseFloat(costo_max))
        }

        if (especializacion) {
            query += ` AND e.nombre LIKE @especializacion`
            request.input('especializacion', sql.VarChar, `%${especializacion}%`)
        }

        query += ` ORDER BY e.nombre, s.nombre`

        const result = await request.query(query)

        res.json({
            total: result.recordset.length,
            servicios: result.recordset
        })
    } catch (err) {
        console.error('Error al buscar servicios:', err)
        res.status(500).json({ error: 'Error al obtener servicios', detalle: err.message })
    }
})

// GET /api/servicios/buscar?q=texto - Búsqueda por texto libre
router.get('/buscar', async (req, res) => {
    try {
        const { q } = req.query

        if (!q || q.trim() === '') {
            return res.status(400).json({ error: 'Debes proporcionar un término de búsqueda (q)' })
        }

        const request = new sql.Request()
        request.input('termino', sql.VarChar, `%${q}%`)

        const result = await request.query(`
            SELECT 
                s.id_servicio,
                s.nombre,
                s.descripcion,
                s.costo,
                s.tiempo_estimado,
                e.nombre AS especializacion
            FROM Servicios s
            LEFT JOIN Especializaciones e ON s.id_especializacion = e.id_especializacion
            WHERE s.activo = 1
              AND (
                  s.nombre LIKE @termino
                  OR s.descripcion LIKE @termino
                  OR e.nombre LIKE @termino
              )
            ORDER BY s.costo ASC
        `)

        res.json({
            termino: q,
            total: result.recordset.length,
            servicios: result.recordset
        })
    } catch (err) {
        console.error('Error en búsqueda de servicios:', err)
        res.status(500).json({ error: 'Error al buscar servicios', detalle: err.message })
    }
})

// GET /api/servicios/:id - Obtener servicio por ID
router.get('/:id', async (req, res) => {
    try {
        const request = new sql.Request()
        request.input('id', sql.Int, parseInt(req.params.id))

        const result = await request.query(`
            SELECT 
                s.*,
                e.nombre AS especializacion,
                e.descripcion AS descripcion_especializacion
            FROM Servicios s
            LEFT JOIN Especializaciones e ON s.id_especializacion = e.id_especializacion
            WHERE s.id_servicio = @id
        `)

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' })
        }

        res.json(result.recordset[0])
    } catch (err) {
        console.error('Error al obtener servicio:', err)
        res.status(500).json({ error: 'Error al obtener servicio', detalle: err.message })
    }
})

module.exports = router
