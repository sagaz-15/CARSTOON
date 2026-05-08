const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/ordenes', require('./routes/ordenes'));
app.use('/api/citas', require('./routes/citas'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/mecanicos', require('./routes/mecanicos'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
