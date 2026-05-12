const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'carstoon_secreto_2024'

// Middleware para verificar token
function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.usuario = decoded
        next()
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado' })
    }
}

module.exports = { verificarToken }
