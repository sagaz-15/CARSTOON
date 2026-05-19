import pyodbc

CADENA_CONEXION = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=LAPTOP-8K7LOV2H\\SQLEXPRESS;"
    "DATABASE=CARSTOON;"
    "Trusted_Connection=yes;"
)

# Pool simple — pyodbc tiene pooling automático con este parámetro
pyodbc.pooling = True

_conn = None

def get_connection():
    global _conn
    try:
        # Si ya hay conexión activa, reutilizarla
        if _conn:
            try:
                _conn.cursor().execute("SELECT 1")
                return _conn
            except:
                # Conexión muerta, crear una nueva
                _conn = None

        _conn = pyodbc.connect(CADENA_CONEXION, autocommit=False)
        return _conn

    except Exception as e:
        print(f" Error de conexión: {e}")
        raise