import pyodbc

# Misma autenticación que tu Windows Forms — sin usuario ni contraseña
CADENA_CONEXION = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=LAPTOP-8K7LOV2H\\SQLEXPRESS;"
    "DATABASE=CARSTOON;"
    "Trusted_Connection=yes;"
)

def get_connection():
    try:
        conn = pyodbc.connect(CADENA_CONEXION)
        print("✅ Conectado a SQL Server")
        return conn
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        raise