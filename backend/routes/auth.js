const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()
const { sql } = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || 'carstoon_secreto_2024'

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo_electronico, password, telefono, ciudad } = req.body

        if (!nombre || !correo_electronico || !password) {
            return res.status(400).json({ error: 'Nombre, correo y password son requeridos' })
        }

        // Verificar si ya existe
        const checkRequest = new sql.Request()
        checkRequest.input('correo', sql.VarChar, correo_electronico)
        const existe = await checkRequest.query(
            `SELECT id_usuario FROM Usuarios WHERE correo_electronico = @correo`
        )

        if (existe.recordset.length > 0) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese correo' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const request = new sql.Request()
        request.input('nombre', sql.VarChar, nombre)
        request.input('correo', sql.VarChar, correo_electronico)
        request.input('password', sql.VarChar, hashedPassword)
        request.input('telefono', sql.VarChar, telefono || null)
        request.input('ciudad', sql.VarChar, ciudad || null)

        await request.query(`
            INSERT INTO Usuarios (nombre, correo_electronico, contraseña, telefono, ciudad)
            VALUES (@nombre, @correo, @password, @telefono, @ciudad)
        `)

        res.status(201).json({ mensaje: 'Usuario creado exitosamente' })
    } catch (err) {
        console.error('Error en registro:', err)
        res.status(500).json({ error: 'Error al registrar usuario', detalle: err.message })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { correo_electronico, password } = req.body

        if (!correo_electronico || !password) {
            return res.status(400).json({ error: 'Correo y password son requeridos' })
        }

        const request = new sql.Request()
        request.input('correo', sql.VarChar, correo_electronico)

        const result = await request.query(`
            SELECT id_usuario, nombre, correo_electronico, contraseña, tipo_usuario
            FROM Usuarios
            WHERE correo_electronico = @correo AND activo = 1
        `)

        const usuario = result.recordset[0]

        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' })
        }

        const valido = await bcrypt.compare(password, usuario.contraseña)

        if (!valido) {
            return res.status(401).json({ error: 'Contraseña incorrecta' })
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, tipo: usuario.tipo_usuario },
            JWT_SECRET,
            { expiresIn: '8h' }
        )

        res.json({
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo_electronico,
                tipo: usuario.tipo_usuario
            }
        })
    } catch (err) {
        console.error('Error en login:', err)
        res.status(500).json({ error: 'Error al iniciar sesión', detalle: err.message })
    }
})

module.exports = router
