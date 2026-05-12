const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()

const { sql } = require('../db')

router.post('/registro', async (req, res) => {

    const { nombre, correo, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    await sql.query`
        INSERT INTO usuarios(nombre, correo, password)
        VALUES(${nombre}, ${correo}, ${hashedPassword})
    `

    res.json({
        mensaje: 'Usuario creado'
    })
})

router.post('/login', async (req, res) => {

    const { correo, password } = req.body

    const result = await sql.query`
        SELECT * FROM usuarios
        WHERE correo = ${correo}
    `

    const usuario = result.recordset[0]

    if (!usuario) {
        return res.status(401).json({
            mensaje: 'Usuario no encontrado'
        })
    }

    const valido = await bcrypt.compare(password, usuario.password)

    if (!valido) {
        return res.status(401).json({
            mensaje: 'Contraseña incorrecta'
        })
    }

    const token = jwt.sign(
        { id: usuario.id },
        'secreto',
        { expiresIn: '1h' }
    )

    res.json({
        token
    })
})

module.exports = router
