require('dotenv').config()

const sql = require('mssql/msnodesqlv8')

const config = {
    connectionString:
        `Driver={ODBC Driver 17 for SQL Server};` +
        `Server=${process.env.DB_SERVER};` +
        `Database=${process.env.DB_DATABASE};` +
        `Trusted_Connection=Yes;`,

    options: {
        trustServerCertificate: true
    }
}

async function connectDB() {
    try {
        await sql.connect(config)
        console.log('✅ Conectado a SQL Server exitosamente')
    } catch (err) {
        console.error('❌ Error completo:')
        console.log(err)
    }
}

module.exports = {
    sql,
    connectDB
}