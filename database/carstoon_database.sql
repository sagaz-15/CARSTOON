-- =====================================================
-- BASE DE DATOS CARSTOON
-- Sistema de Renta y Personalización de Autos
-- =====================================================

CREATE DATABASE CARSTOON
GO

USE CARSTOON
GO

-- =====================================================
-- TABLA: Usuarios (Clientes)
-- =====================================================
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(50),
    fecha_registro DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    tipo_usuario VARCHAR(20) DEFAULT 'cliente' -- 'cliente' o 'mecanico'
);

-- =====================================================
-- TABLA: Vehiculos (Inventario de autos para renta)
-- =====================================================
CREATE TABLE Vehiculos (
    id_vehiculo INT PRIMARY KEY IDENTITY(1,1),
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    color VARCHAR(30),
    placa VARCHAR(20) UNIQUE,
    precio_renta_diaria DECIMAL(10, 2) NOT NULL,
    disponible BIT DEFAULT 1,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    fecha_creacion DATETIME DEFAULT GETDATE()
);

-- =====================================================
-- TABLA: Especializaciones (Para mecánicos)
-- =====================================================
CREATE TABLE Especializaciones (
    id_especializacion INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- =====================================================
-- TABLA: Mecanicos
-- =====================================================
CREATE TABLE Mecanicos (
    id_mecanico INT PRIMARY KEY IDENTITY(1,1),
    id_usuario INT NOT NULL UNIQUE,
    especialidad_principal INT,
    experiencia_anios INT,
    calificacion DECIMAL(3,2) DEFAULT 0,
    disponible BIT DEFAULT 1,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (especialidad_principal) REFERENCES Especializaciones(id_especializacion)
);

-- =====================================================
-- TABLA: Servicios de Personalización
-- =====================================================
CREATE TABLE Servicios (
    id_servicio INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2) NOT NULL,
    tiempo_estimado INT, -- en horas
    id_especializacion INT,
    activo BIT DEFAULT 1,
    FOREIGN KEY (id_especializacion) REFERENCES Especializaciones(id_especializacion)
);

-- =====================================================
-- TABLA: Metodos de Pago
-- =====================================================
CREATE TABLE MetodosPago (
    id_metodo_pago INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL UNIQUE, -- 'Tarjeta de Crédito', 'PayPal', 'Transferencia', etc.
    activo BIT DEFAULT 1
);

-- =====================================================
-- TABLA: Ordenes (Renta o Personalización)
-- =====================================================
CREATE TABLE Ordenes (
    id_orden INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT NOT NULL,
    tipo_orden VARCHAR(20) NOT NULL, -- 'renta' o 'personalizacion'
    estado VARCHAR(30) DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada'
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    costo_total DECIMAL(10, 2),
    FOREIGN KEY (id_cliente) REFERENCES Usuarios(id_usuario)
);

-- =====================================================
-- TABLA: Ordenes de Renta
-- =====================================================
CREATE TABLE OrdenesRenta (
    id_orden_renta INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL UNIQUE,
    id_vehiculo INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    dias_renta INT,
    precio_por_dia DECIMAL(10, 2) NOT NULL,
    seguro_incluido BIT DEFAULT 0,
    costo_seguro DECIMAL(10, 2) DEFAULT 0,
    monto_deposito DECIMAL(10, 2),
    estado_devolucion VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'entregado'
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_vehiculo) REFERENCES Vehiculos(id_vehiculo)
);

-- =====================================================
-- TABLA: Ordenes de Personalización
-- =====================================================
CREATE TABLE OrdenesPersonalizacion (
    id_orden_personalizacion INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL UNIQUE,
    id_vehiculo_cliente INT, -- NULL si es de inventario
    id_mecanico INT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin_estimada DATETIME,
    fecha_fin_real DATETIME,
    descripcion_trabajo TEXT,
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_vehiculo_cliente) REFERENCES Vehiculos(id_vehiculo),
    FOREIGN KEY (id_mecanico) REFERENCES Mecanicos(id_mecanico)
);

-- =====================================================
-- TABLA: Servicios en Ordenes de Personalización
-- =====================================================
CREATE TABLE ServiciosOrden (
    id_servicio_orden INT PRIMARY KEY IDENTITY(1,1),
    id_orden_personalizacion INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_orden_personalizacion) REFERENCES OrdenesPersonalizacion(id_orden_personalizacion),
    FOREIGN KEY (id_servicio) REFERENCES Servicios(id_servicio)
);

-- =====================================================
-- TABLA: Pagos
-- =====================================================
CREATE TABLE Pagos (
    id_pago INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME DEFAULT GETDATE(),
    estado_pago VARCHAR(20) DEFAULT 'completado', -- 'pendiente', 'completado', 'fallido', 'reembolsado'
    numero_transaccion VARCHAR(100),
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodosPago(id_metodo_pago)
);

-- =====================================================
-- TABLA: Reseñas y Calificaciones
-- =====================================================
CREATE TABLE Resenas (
    id_resena INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL,
    id_cliente INT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_resena DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_cliente) REFERENCES Usuarios(id_usuario)
);

-- =====================================================
-- TABLA: Citas (Para reservar personalización o renta)
-- =====================================================
CREATE TABLE Citas (
    id_cita INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT NOT NULL,
    tipo_cita VARCHAR(20) NOT NULL, -- 'renta' o 'personalizacion'
    fecha_cita DATETIME NOT NULL,
    duracion_minutos INT,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'confirmada', -- 'confirmada', 'completada', 'cancelada'
    id_mecanico INT, -- Solo si es para personalización
    fecha_creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_cliente) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_mecanico) REFERENCES Mecanicos(id_mecanico)
);

-- =====================================================
-- TABLA: Historial de Cambios (Auditoría)
-- =====================================================
CREATE TABLE HistorialCambios (
    id_cambio INT PRIMARY KEY IDENTITY(1,1),
    tabla_afectada VARCHAR(50),
    id_registro INT,
    tipo_cambio VARCHAR(20), -- 'INSERT', 'UPDATE', 'DELETE'
    valores_anteriores TEXT,
    valores_nuevos TEXT,
    id_usuario_cambio INT,
    fecha_cambio DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario_cambio) REFERENCES Usuarios(id_usuario)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================
CREATE INDEX idx_usuarios_correo ON Usuarios(correo_electronico);
CREATE INDEX idx_usuarios_tipo ON Usuarios(tipo_usuario);
CREATE INDEX idx_vehiculos_disponible ON Vehiculos(disponible);
CREATE INDEX idx_ordenes_cliente ON Ordenes(id_cliente);
CREATE INDEX idx_ordenes_estado ON Ordenes(estado);
CREATE INDEX idx_ordenes_tipo ON Ordenes(tipo_orden);
CREATE INDEX idx_pagos_orden ON Pagos(id_orden);
CREATE INDEX idx_pagos_estado ON Pagos(estado_pago);
CREATE INDEX idx_citas_cliente ON Citas(id_cliente);
CREATE INDEX idx_citas_fecha ON Citas(fecha_cita);
CREATE INDEX idx_resenas_orden ON Resenas(id_orden);

-- =====================================================
-- INSERTAR DATOS DE PRUEBA
-- =====================================================

-- Especializaciones
INSERT INTO Especializaciones (nombre, descripcion) VALUES
('Pintura y Diseño', 'Pintura personalizada, aerografía y diseños gráficos'),
('Interior y Tapicería', 'Personalización de interiores, tapicería y accesorios'),
('Mecánica de Rendimiento', 'Mejoras de rendimiento y motor'),
('Sistemas Electrónicos', 'Instalación de sistemas electrónicos y tecnología');

-- Métodos de Pago
INSERT INTO MetodosPago (nombre) VALUES
('Tarjeta de Crédito'),
('Tarjeta de Débito'),
('PayPal'),
('Transferencia Bancaria'),
('Efectivo');

-- Servicios de Personalización
INSERT INTO Servicios (nombre, descripcion, costo, tiempo_estimado, id_especializacion) VALUES
('Pintura Metalizada', 'Repintado con pintura metalizada premium', 350.00, 8, 1),
('Aerografía Personalizada', 'Diseño gráfico personalizado en la carrocería', 500.00, 12, 1),
('Cambio de Interior', 'Cambio completo del interior del vehículo', 800.00, 16, 2),
('Sistema de Audio Premium', 'Instalación de sistema de audio de alta gama', 450.00, 6, 4),
('Aumento de Potencia', 'Aumento de rendimiento del motor', 600.00, 10, 3),
('Llantas Deportivas', 'Cambio a llantas deportivas premium', 250.00, 4, 3),
('Iluminación LED', 'Cambio a iluminación LED personalizada', 300.00, 5, 4);

GO
