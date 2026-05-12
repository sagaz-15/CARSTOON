const sql = require('mssql')

const config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'CARSTOON',
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
}

async function connectDB() {
    try {
        await sql.connect(config)
        console.log('Conectado a SQL Server')
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    sql,
    connectDB
}
