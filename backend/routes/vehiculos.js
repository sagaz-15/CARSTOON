const express = require('express')
const router = express.Router()
const { sql } = require('../db')

// GET /api/vehiculos - Listar todos los vehículos disponibles
// Query params: marca, modelo, anio, precio_max, disponible
router.get('/', async (req, res) => {
    try {
        const { marca, modelo, anio, precio_max, disponible } = req.query

        let query = `
            SELECT 
                id_vehiculo,
                marca,
                modelo,
                anio,
                color,
                placa,
                precio_renta_diaria,
                disponible,
                descripcion,
                imagen_url
            FROM Vehiculos
            WHERE 1=1
        `

        const request = new sql.Request()

        if (marca) {
            query += ` AND marca LIKE @marca`
            request.input('marca', sql.VarChar, `%${marca}%`)
        }

        if (modelo) {
            query += ` AND modelo LIKE @modelo`
            request.input('modelo', sql.VarChar, `%${modelo}%`)
        }

        if (anio) {
            query += ` AND anio = @anio`
            request.input('anio', sql.Int, parseInt(anio))
        }

        if (precio_max) {
            query += ` AND precio_renta_diaria <= @precio_max`
            request.input('precio_max', sql.Decimal(10, 2), parseFloat(precio_max))
        }

        // Por defecto solo los disponibles, a menos que pidan todos
        if (disponible !== 'todos') {
            const disp = disponible === 'false' ? 0 : 1
            query += ` AND disponible = @disponible`
            request.input('disponible', sql.Bit, disp)
        }

        query += ` ORDER BY marca, modelo`

        const result = await request.query(query)

        res.json({
            total: result.recordset.length,
            vehiculos: result.recordset
        })
    } catch (err) {
        console.error('Error al buscar vehículos:', err)
        res.status(500).json({ error: 'Error al obtener vehículos', detalle: err.message })
    }
})

// GET /api/vehiculos/buscar?q=texto - Búsqueda general por texto
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
                id_vehiculo,
                marca,
                modelo,
                anio,
                color,
                placa,
                precio_renta_diaria,
                disponible,
                descripcion,
                imagen_url
            FROM Vehiculos
            WHERE 
                marca LIKE @termino
                OR modelo LIKE @termino
                OR color LIKE @termino
                OR descripcion LIKE @termino
                OR CAST(anio AS VARCHAR) LIKE @termino
            ORDER BY disponible DESC, marca, modelo
        `)

        res.json({
            termino: q,
            total: result.recordset.length,
            vehiculos: result.recordset
        })
    } catch (err) {
        console.error('Error en búsqueda de vehículos:', err)
        res.status(500).json({ error: 'Error al buscar vehículos', detalle: err.message })
    }
})

// GET /api/vehiculos/:id - Obtener un vehículo por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const request = new sql.Request()
        request.input('id', sql.Int, parseInt(id))

        const result = await request.query(`
            SELECT *
            FROM Vehiculos
            WHERE id_vehiculo = @id
        `)

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Vehículo no encontrado' })
        }

        res.json(result.recordset[0])
    } catch (err) {
        console.error('Error al obtener vehículo:', err)
        res.status(500).json({ error: 'Error al obtener vehículo', detalle: err.message })
    }
})

module.exports = router
