
-- BASE DE DATOS CARSTOON (OPTIMIZADA)

CREATE DATABASE CARSTOON
GO

USE CARSTOON
GO


-- TABLA: Usuarios (Exclusiva para Clientes Web)

CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(50),
    fecha_registro DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1
);
GO


-- TABLA: Vehiculos (Inventario)

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
    imagen_url VARCHAR(255)
);
GO


-- TABLA: Especializaciones

CREATE TABLE Especializaciones (
    id_especializacion INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);
GO


-- TABLA: Mecanicos (Personal Interno Independiente)

CREATE TABLE Mecanicos (
    id_mecanico INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    id_especializacion_principal INT,
    experiencia_anios INT,
    calificacion DECIMAL(3,2) DEFAULT 0,
    disponible BIT DEFAULT 1,
    FOREIGN KEY (id_especializacion_principal) REFERENCES Especializaciones(id_especializacion)
);
GO


-- TABLA: Servicios de Personalización

CREATE TABLE Servicios (
    id_servicio INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2) NOT NULL,
    tiempo_estimado_horas INT,
    id_especializacion INT,
    activo BIT DEFAULT 1,
    FOREIGN KEY (id_especializacion) REFERENCES Especializaciones(id_especializacion)
);
GO


-- TABLA: Metodos de Pago

CREATE TABLE MetodosPago (
    id_metodo_pago INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(50) NOT NULL UNIQUE, 
    activo BIT DEFAULT 1
);
GO


-- TABLA: Ordenes (Maestra)

CREATE TABLE Ordenes (
    id_orden INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT NOT NULL,
    tipo_orden VARCHAR(20) NOT NULL, 
    estado VARCHAR(30) DEFAULT 'pendiente', 
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    costo_total DECIMAL(10, 2),
    FOREIGN KEY (id_cliente) REFERENCES Usuarios(id_usuario)
);
GO


-- TABLA: Ordenes de Renta

CREATE TABLE OrdenesRenta (
    id_orden_renta INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL UNIQUE,
    id_vehiculo INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    precio_por_dia DECIMAL(10, 2) NOT NULL,
    monto_deposito DECIMAL(10, 2),
    estado_devolucion VARCHAR(20) DEFAULT 'pendiente', 
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_vehiculo) REFERENCES Vehiculos(id_vehiculo)
);
GO


-- TABLA: Ordenes de Personalización

CREATE TABLE OrdenesPersonalizacion (
    id_orden_personalizacion INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL UNIQUE,
    id_vehiculo_cliente INT, 
    id_mecanico INT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin_estimada DATETIME,
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_vehiculo_cliente) REFERENCES Vehiculos(id_vehiculo),
    FOREIGN KEY (id_mecanico) REFERENCES Mecanicos(id_mecanico)
);
GO


-- TABLA: Servicios en Ordenes de Personalización

CREATE TABLE ServiciosOrden (
    id_servicio_orden INT PRIMARY KEY IDENTITY(1,1),
    id_orden_personalizacion INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_orden_personalizacion) REFERENCES OrdenesPersonalizacion(id_orden_personalizacion),
    FOREIGN KEY (id_servicio) REFERENCES Servicios(id_servicio)
);
GO


-- TABLA: Pagos

CREATE TABLE Pagos (
    id_pago INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATETIME DEFAULT GETDATE(),
    estado_pago VARCHAR(20) DEFAULT 'completado', 
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden),
    FOREIGN KEY (id_metodo_pago) REFERENCES MetodosPago(id_metodo_pago)
);
GO


-- TABLA: Reseñas y Calificaciones

CREATE TABLE Resenas (
    id_resena INT PRIMARY KEY IDENTITY(1,1),
    id_orden INT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_resena DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_orden) REFERENCES Ordenes(id_orden)
);
GO


-- TABLA: Citas 

CREATE TABLE Citas (
    id_cita INT PRIMARY KEY IDENTITY(1,1),
    id_cliente INT NOT NULL,
    tipo_cita VARCHAR(20) NOT NULL,
    fecha_cita DATETIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada', 
    id_mecanico INT, 
    FOREIGN KEY (id_cliente) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_mecanico) REFERENCES Mecanicos(id_mecanico)
);
GO



-- =====================================================
-- VISTA: Monitor de Taller (Tablero de Control)
-- =====================================================

CREATE VIEW VistaTableroControl AS
SELECT 
    m.nombre AS [Mecanico],
    u.nombre AS [Cliente],
    v.marca + ' ' + v.modelo AS [Vehiculo],
    v.placa AS [Placa],
    o.estado AS [Estado de Orden],
    s.nombre AS [Servicio Prestado],
    o.fecha_creacion AS [Fecha de Inicio]
FROM Ordenes o
JOIN Usuarios u ON o.id_cliente = u.id_usuario
JOIN OrdenesPersonalizacion op ON o.id_orden = op.id_orden
JOIN Mecanicos m ON op.id_mecanico = m.id_mecanico
JOIN Vehiculos v ON op.id_vehiculo_cliente = v.id_vehiculo
JOIN ServiciosOrden so ON op.id_orden_personalizacion = so.id_orden_personalizacion
JOIN Servicios s ON so.id_servicio = s.id_servicio;
GO



-- ELIMINACIÓN EN ORDEN DE JERARQUÍA
DELETE FROM Resenas;
DELETE FROM Pagos;
DELETE FROM ServiciosOrden;
DELETE FROM OrdenesPersonalizacion;
DELETE FROM OrdenesRenta;
DELETE FROM Citas;
DELETE FROM Ordenes;
DELETE FROM Servicios;
DELETE FROM Mecanicos;
DELETE FROM Especializaciones;
DELETE FROM Vehiculos;
DELETE FROM MetodosPago;
DELETE FROM Usuarios;

-- RESETEO DE IDENTIDADES
DBCC CHECKIDENT ('Usuarios', RESEED, 0);
DBCC CHECKIDENT ('Vehiculos', RESEED, 0);
DBCC CHECKIDENT ('Especializaciones', RESEED, 0);
DBCC CHECKIDENT ('Mecanicos', RESEED, 0);
DBCC CHECKIDENT ('Servicios', RESEED, 0);
DBCC CHECKIDENT ('MetodosPago', RESEED, 0);
DBCC CHECKIDENT ('Ordenes', RESEED, 0);
DBCC CHECKIDENT ('OrdenesRenta', RESEED, 0);
DBCC CHECKIDENT ('OrdenesPersonalizacion', RESEED, 0);
DBCC CHECKIDENT ('ServiciosOrden', RESEED, 0);
DBCC CHECKIDENT ('Pagos', RESEED, 0);
DBCC CHECKIDENT ('Resenas', RESEED, 0);
DBCC CHECKIDENT ('Citas', RESEED, 0);
GO



INSERT INTO Usuarios (nombre, correo_electronico, contraseña, telefono, direccion, ciudad) VALUES
('Sebastian Valencia', 'sebastian@dev.com', 'pass123', '3009998877', 'Poblado Cra 43', 'Medellín'),
('Valentina Osorio', 'vale@dev.com', 'pass456', '3112223344', 'Laureles Calle 33', 'Medellín'),
('Mateo Arango', 'mateo@dev.com', 'pass789', '3205556677', 'Envigado Transv 20', 'Envigado');


INSERT INTO Vehiculos (marca, modelo, anio, color, placa, precio_renta_diaria, disponible, descripcion) VALUES
('Ford', 'Mustang GT', 2024, 'Negro', 'MUS-001', 550000.00, 1, 'Deportivo de alto rendimiento'),
('BMW', 'X5', 2023, 'Azul M', 'BMW-055', 480000.00, 1, 'SUV de lujo blindada'),
('Nissan', 'GT-R', 2022, 'Gris', 'GTR-350', 600000.00, 1, 'Godzilla japonés para personalización');


INSERT INTO Especializaciones (nombre, descripcion) VALUES
('Tunneo de Motor', 'Reprogramación de ECU y Stage 1, 2, 3'),
('Detailing Premium', 'Cerámico, pulido y limpieza profunda'),
('Blindaje', 'Protección nivel 2 y 3 para vehículos de alta gama');


INSERT INTO Mecanicos (nombre, telefono, id_especializacion_principal, experiencia_anios, calificacion) VALUES
('Luis Sanchez', '3001002030', 1, 15, 5.00),
('Elena Ruiz', '3152003040', 2, 7, 4.70),
('Daniel Cano', '3203004050', 3, 10, 4.90);


INSERT INTO Servicios (nombre, descripcion, costo, tiempo_estimado_horas, id_especializacion) VALUES
('Reprogramación ECU', 'Aumento de HP mediante software', 1200000.00, 3, 1),
('Recubrimiento Cerámico', 'Protección de pintura por 3 años', 950000.00, 8, 2),
('Refuerzo de Puertas', 'Instalación de paneles de Kevlar', 2500000.00, 24, 3);


INSERT INTO MetodosPago (nombre) VALUES ('Nequi'), ('Bancolombia'), ('PayPal');


INSERT INTO Ordenes (id_cliente, tipo_orden, estado, descripcion, costo_total) VALUES
(1, 'renta', 'completada', 'Renta Mustang 1 día', 550000.00),
(2, 'personalizacion', 'pendiente', 'Cerámico BMW X5', 950000.00),
(3, 'renta', 'en proceso', 'Renta GT-R fin de semana', 1200000.00);


INSERT INTO OrdenesRenta (id_orden, id_vehiculo, fecha_inicio, fecha_fin, precio_por_dia, monto_deposito) VALUES
(1, 1, GETDATE(), GETDATE()+1, 550000.00, 500000.00),
(3, 3, GETDATE(), GETDATE()+2, 600000.00, 1000000.00);


INSERT INTO OrdenesPersonalizacion (id_orden, id_vehiculo_cliente, id_mecanico, fecha_inicio, fecha_fin_estimada) VALUES
(2, 2, 2, GETDATE(), GETDATE()+1);


INSERT INTO ServiciosOrden (id_orden_personalizacion, id_servicio, cantidad, subtotal) VALUES
(1, 2, 1, 950000.00);


INSERT INTO Pagos (id_orden, id_metodo_pago, monto, estado_pago) VALUES
(1, 1, 550000.00, 'completado'),
(3, 2, 1200000.00, 'completado');


INSERT INTO Citas (id_cliente, tipo_cita, fecha_cita, estado, id_mecanico) VALUES
(2, 'personalizacion', GETDATE()+2, 'confirmada', 2),
(1, 'renta', GETDATE()+5, 'confirmada', NULL);
GO
