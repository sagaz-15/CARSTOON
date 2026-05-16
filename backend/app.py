from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

# ─── USUARIOS ────────────────────────────────────────────────────────────────

@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_usuario, nombre, correo_electronico, telefono, ciudad, fecha_registro, activo FROM Usuarios")
        columnas = [col[0] for col in cursor.description]
        usuarios = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(usuarios)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/usuarios/<int:id>', methods=['GET'])
def get_usuario(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id_usuario, nombre, correo_electronico, telefono, ciudad FROM Usuarios WHERE id_usuario = ?", id)
        columnas = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        return jsonify(dict(zip(columnas, row)))
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
             data.get('telefono'), data.get('direccion'), data.get('ciudad'))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Usuario registrado correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/usuarios/login', methods=['POST'])
def login():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id_usuario, nombre, correo_electronico, ciudad
            FROM Usuarios
            WHERE correo_electronico = ? AND contraseña = ? AND activo = 1
        """, data['correo_electronico'], data['contraseña'])
        columnas = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'error': 'Credenciales incorrectas'}), 401
        return jsonify({'mensaje': 'Login exitoso', 'usuario': dict(zip(columnas, row))})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── VEHÍCULOS ───────────────────────────────────────────────────────────────

@app.route('/vehiculos', methods=['GET'])
def get_vehiculos():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Vehiculos WHERE disponible = 1")
        columnas = [col[0] for col in cursor.description]
        vehiculos = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(vehiculos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/vehiculos/<int:id>', methods=['GET'])
def get_vehiculo(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Vehiculos WHERE id_vehiculo = ?", id)
        columnas = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        conn.close()
        if not row:
            return jsonify({'error': 'Vehículo no encontrado'}), 404
        return jsonify(dict(zip(columnas, row)))
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
        columnas = [col[0] for col in cursor.description]
        servicios = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(servicios)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
        columnas = [col[0] for col in cursor.description]
        mecanicos = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(mecanicos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── ÓRDENES ─────────────────────────────────────────────────────────────────

@app.route('/ordenes/cliente/<int:id>', methods=['GET'])
def get_ordenes_cliente(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Ordenes WHERE id_cliente = ? ORDER BY fecha_creacion DESC", id)
        columnas = [col[0] for col in cursor.description]
        ordenes = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(ordenes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/ordenes/renta', methods=['POST'])
def crear_orden_renta():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()

        from datetime import datetime
        fecha_inicio = datetime.fromisoformat(data['fecha_inicio'])
        fecha_fin    = datetime.fromisoformat(data['fecha_fin'])
        dias         = max((fecha_fin - fecha_inicio).days, 1)
        costo_total  = dias * float(data['precio_por_dia'])

        # Insertar orden maestra
        cursor.execute("""
            INSERT INTO Ordenes (id_cliente, tipo_orden, estado, descripcion, costo_total)
            OUTPUT INSERTED.id_orden
            VALUES (?, 'renta', 'pendiente', ?, ?)
        """, data['id_cliente'], data.get('descripcion', 'Renta de vehículo'), costo_total)
        id_orden = cursor.fetchone()[0]

        # Insertar orden de renta
        cursor.execute("""
            INSERT INTO OrdenesRenta (id_orden, id_vehiculo, fecha_inicio, fecha_fin, precio_por_dia, monto_deposito)
            VALUES (?, ?, ?, ?, ?, ?)
        """, id_orden, data['id_vehiculo'], fecha_inicio, fecha_fin,
             data['precio_por_dia'], data.get('monto_deposito', 0))

        # Marcar vehículo no disponible
        cursor.execute("UPDATE Vehiculos SET disponible = 0 WHERE id_vehiculo = ?", data['id_vehiculo'])

        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Orden de renta creada', 'id_orden': id_orden, 'costo_total': costo_total}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
        columnas = [col[0] for col in cursor.description]
        citas = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(citas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
        conn.close()
        return jsonify({'mensaje': 'Cita agendada correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── TABLERO ─────────────────────────────────────────────────────────────────

@app.route('/tablero', methods=['GET'])
def get_tablero():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM VistaTableroControl")
        columnas = [col[0] for col in cursor.description]
        filas = [dict(zip(columnas, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(filas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── RESEÑAS ─────────────────────────────────────────────────────────────────

@app.route('/resenas', methods=['POST'])
def crear_resena():
    data = request.json
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Resenas (id_orden, calificacion, comentario)
            VALUES (?, ?, ?)
        """, data['id_orden'], data['calificacion'], data.get('comentario'))
        conn.commit()
        conn.close()
        return jsonify({'mensaje': 'Reseña registrada'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─── INICIO ──────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("🚀 Servidor CARSTOONS corriendo en http://localhost:3000")
    app.run(debug=True, port=3000)