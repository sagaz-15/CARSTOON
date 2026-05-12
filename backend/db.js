const sql = require('mssql')

const config = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '123456',
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'CARSTOON',
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
}

async function connectDB() {
    try {
        await sql.connect(config)
        console.log('✅ Conectado a SQL Server exitosamente')
    } catch (err) {
        console.error('❌ Error al conectar a SQL Server:', err.message)
        // No cerramos el proceso para permitir desarrollo sin BD
    }
}

module.exports = {
    sql,
    connectDB
}
