require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const { connectDB } = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')))

// Conectar a la base de datos
connectDB()

// =====================================================
// RUTAS DE LA API
// =====================================================
const authRoutes      = require('./routes/auth')
const vehiculosRoutes = require('./routes/vehiculos')
const serviciosRoutes = require('./routes/servicios')
const mecanicosRoutes = require('./routes/mecanicos')

app.use('/api/auth',      authRoutes)
app.use('/api/vehiculos', vehiculosRoutes)
app.use('/api/servicios', serviciosRoutes)
app.use('/api/mecanicos', mecanicosRoutes)

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Inicio.html'))
})

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`   GET  /api/vehiculos             → Listar vehículos`)
    console.log(`   GET  /api/vehiculos/buscar?q=   → Buscar vehículos`)
    console.log(`   GET  /api/servicios             → Listar servicios`)
    console.log(`   GET  /api/servicios/buscar?q=   → Buscar servicios`)
    console.log(`   GET  /api/mecanicos             → Listar mecánicos`)
    console.log(`   POST /api/auth/registro         → Registrar usuario`)
    console.log(`   POST /api/auth/login            → Iniciar sesión`)
})
