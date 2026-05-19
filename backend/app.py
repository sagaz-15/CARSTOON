from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from db import get_connection
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ─── FRONTEND ESTÁTICO ────────────────────────────────────────────────────────
# Ajusta esta ruta a la carpeta frontend de tu proyecto
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend')

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_frontend(path):
    # Si la ruta corresponde a un endpoint de la API, Flask lo ignora aquí
    # porque las rutas de API se registran antes y tienen prioridad
    return send_from_directory(FRONTEND_DIR, path)

# ─── HELPER ──────────────────────────────────────────────────────────────────

def filas_a_dict(cursor):
    columnas = [col[0] for col in cursor.description]
    return [dict(zip(columnas, row)) for row in cursor.fetchall()]

def fila_a_dict(cursor):
    columnas = [col[0] for col in cursor.description]
    row = cursor.fetchone()
    return dict(zip(columnas, row)) if row else None

# ─── USUARIOS ────────────────────────────────────────────────────────────────

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_usuario, nombre, correo_electronico, telefono, ciudad, fecha_registro, activo FROM Usuarios")
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/usuarios/registro', methods=['POST'])
def registrar_usuario():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Usuarios (nombre, correo_electronico, contraseña, telefono, direccion, ciudad)
            VALUES (?, ?, ?, ?, ?, ?)
        """, data['nombre'], data['correo_electronico'], data['contraseña'],
             data.get('telefono', ''), data.get('direccion', ''), data.get('ciudad', ''))
        conn.commit()
        return jsonify({'mensaje': 'Usuario registrado correctamente'}), 201
    except Exception as e:
        if '2627' in str(e) or 'UNIQUE' in str(e).upper():
            return jsonify({'error': 'El correo ya está registrado'}), 409
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/usuarios/login', methods=['POST'])
def login():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id_usuario, nombre, correo_electronico, ciudad, telefono
            FROM Usuarios
            WHERE correo_electronico = ? AND contraseña = ? AND activo = 1
        """, data['correo_electronico'], data['contraseña'])
        usuario = fila_a_dict(cursor)
        if not usuario:
            return jsonify({'error': 'Correo o contraseña incorrectos'}), 401
        return jsonify({'mensaje': 'Login exitoso', 'usuario': usuario})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_usuario, nombre, correo_electronico, telefono, ciudad FROM Usuarios WHERE id_usuario = ?", id)
        usuario = fila_a_dict(cursor)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        return jsonify(usuario)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── VEHÍCULOS ───────────────────────────────────────────────────────────────

@app.route('/vehiculos', methods=['GET'])
def get_vehiculos():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Vehiculos WHERE disponible = 1")
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/vehiculos/<int:id>', methods=['GET'])
def get_vehiculo(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Vehiculos WHERE id_vehiculo = ?", id)
        v = fila_a_dict(cursor)
        if not v:
            return jsonify({'error': 'Vehículo no encontrado'}), 404
        return jsonify(v)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── SERVICIOS ───────────────────────────────────────────────────────────────

@app.route('/servicios', methods=['GET'])
def get_servicios():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT s.id_servicio, s.nombre, s.descripcion, s.costo, s.tiempo_estimado_horas,
                   e.nombre AS especializacion
            FROM Servicios s
            JOIN Especializaciones e ON s.id_especializacion = e.id_especializacion
            WHERE s.activo = 1
        """)
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── MECÁNICOS ───────────────────────────────────────────────────────────────

@app.route('/mecanicos', methods=['GET'])
def get_mecanicos():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.id_mecanico, m.nombre, m.telefono, m.experiencia_anios, m.calificacion,
                   e.nombre AS especializacion
            FROM Mecanicos m
            JOIN Especializaciones e ON m.id_especializacion_principal = e.id_especializacion
            WHERE m.disponible = 1
        """)
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── ÓRDENES ─────────────────────────────────────────────────────────────────

@app.route('/ordenes/cliente/<int:id>', methods=['GET'])
def get_ordenes_cliente(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id_orden, tipo_orden, estado, descripcion, fecha_creacion, costo_total
            FROM Ordenes
            WHERE id_cliente = ?
            ORDER BY fecha_creacion DESC
        """, id)
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/ordenes/renta', methods=['POST'])
def crear_orden_renta():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()

        fecha_inicio = datetime.fromisoformat(data['fecha_inicio'])
        fecha_fin    = datetime.fromisoformat(data['fecha_fin'])
        dias         = max((fecha_fin - fecha_inicio).days, 1)
        precio_dia   = float(data['precio_por_dia'])
        costo_total  = dias * precio_dia

        cursor.execute("""
            INSERT INTO Ordenes (id_cliente, tipo_orden, estado, descripcion, costo_total)
            OUTPUT INSERTED.id_orden
            VALUES (?, 'renta', 'pendiente', ?, ?)
        """, data['id_cliente'],
             f"Renta de {data.get('nombre_vehiculo', 'vehículo')} por {dias} día(s)",
             costo_total)
        id_orden = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO OrdenesRenta (id_orden, id_vehiculo, fecha_inicio, fecha_fin, precio_por_dia, monto_deposito)
            VALUES (?, ?, ?, ?, ?, ?)
        """, id_orden, data['id_vehiculo'], fecha_inicio, fecha_fin,
             precio_dia, data.get('monto_deposito', precio_dia))

        cursor.execute("UPDATE Vehiculos SET disponible = 0 WHERE id_vehiculo = ?", data['id_vehiculo'])

        conn.commit()
        return jsonify({
            'mensaje': 'Orden de renta creada',
            'id_orden': id_orden,
            'costo_total': costo_total,
            'dias': dias
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/ordenes/personalizacion', methods=['POST'])
def crear_orden_personalizacion():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()

        ids_servicios = data['id_servicios']
        placeholders  = ','.join(['?' for _ in ids_servicios])
        cursor.execute(
            f"SELECT id_servicio, costo FROM Servicios WHERE id_servicio IN ({placeholders})",
            *ids_servicios
        )
        servicios_rows = filas_a_dict(cursor)
        costo_total = sum(float(s['costo']) for s in servicios_rows)

        fecha_inicio  = datetime.now()
        fecha_fin_est = datetime.fromisoformat(data['fecha_fin_estimada']) if data.get('fecha_fin_estimada') else None

        cursor.execute("""
            INSERT INTO Ordenes (id_cliente, tipo_orden, estado, descripcion, costo_total)
            OUTPUT INSERTED.id_orden
            VALUES (?, 'personalizacion', 'pendiente', ?, ?)
        """, data['id_cliente'], data.get('descripcion', 'Personalización de vehículo'), costo_total)
        id_orden = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO OrdenesPersonalizacion (id_orden, id_vehiculo_cliente, id_mecanico, fecha_inicio, fecha_fin_estimada)
            OUTPUT INSERTED.id_orden_personalizacion
            VALUES (?, ?, ?, ?, ?)
        """, id_orden, data.get('id_vehiculo'), data.get('id_mecanico'), fecha_inicio, fecha_fin_est)
        id_orden_pers = cursor.fetchone()[0]

        for s in servicios_rows:
            cursor.execute("""
                INSERT INTO ServiciosOrden (id_orden_personalizacion, id_servicio, cantidad, subtotal)
                VALUES (?, ?, 1, ?)
            """, id_orden_pers, s['id_servicio'], float(s['costo']))

        conn.commit()
        return jsonify({
            'mensaje': 'Orden de personalización creada',
            'id_orden': id_orden,
            'costo_total': costo_total
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── PAGOS ───────────────────────────────────────────────────────────────────

@app.route('/pagos', methods=['POST'])
def registrar_pago():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Pagos (id_orden, id_metodo_pago, monto, estado_pago)
            VALUES (?, ?, ?, 'completado')
        """, data['id_orden'], data['id_metodo_pago'], data['monto'])
        cursor.execute("UPDATE Ordenes SET estado = 'en proceso' WHERE id_orden = ?", data['id_orden'])
        conn.commit()
        return jsonify({'mensaje': 'Pago registrado con éxito', 'estado': 'completado'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/metodos-pago', methods=['GET'])
def get_metodos_pago():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM MetodosPago WHERE activo = 1")
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── CITAS ───────────────────────────────────────────────────────────────────

@app.route('/citas/cliente/<int:id>', methods=['GET'])
def get_citas_cliente(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.id_cita, c.tipo_cita, c.fecha_cita, c.estado, m.nombre AS mecanico
            FROM Citas c
            LEFT JOIN Mecanicos m ON c.id_mecanico = m.id_mecanico
            WHERE c.id_cliente = ?
            ORDER BY c.fecha_cita ASC
        """, id)
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/citas', methods=['POST'])
def crear_cita():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Citas (id_cliente, tipo_cita, fecha_cita, estado, id_mecanico)
            VALUES (?, ?, ?, 'confirmada', ?)
        """, data['id_cliente'], data['tipo_cita'], data['fecha_cita'], data.get('id_mecanico'))
        conn.commit()
        return jsonify({'mensaje': 'Cita agendada correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── TABLERO & RESEÑAS ───────────────────────────────────────────────────────

@app.route('/tablero', methods=['GET'])
def get_tablero():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM VistaTableroControl")
        return jsonify(filas_a_dict(cursor))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@app.route('/resenas', methods=['POST'])
def crear_resena():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Resenas (id_orden, calificacion, comentario)
            VALUES (?, ?, ?)
        """, data['id_orden'], data['calificacion'], data.get('comentario', ''))
        conn.commit()
        return jsonify({'mensaje': 'Reseña registrada'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ─── ARRANQUE ────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print(" Servidor CARSTOONS corriendo en http://localhost:3000")
    app.run(debug=True, port=3000)