const express = require('express')
const cors = require('cors')
const { connectDB } = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000')
})
const authRoutes = require('./routes/auth')

app.use('/api/auth', authRoutes)
