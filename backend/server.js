const express = require('express')
const cors = require('cors')
const { sql, conectarDB } = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

// Conectar base de datos
conectarDB()

// Ruta de prueba
app.get('/usuarios', async (req, res) => {
    try {
        const resultado = await sql.query('SELECT * FROM Usuarios')
        res.json(resultado.recordset)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.listen(3000, () => {
    console.log('🚀 Servidor en http://localhost:3000')
})