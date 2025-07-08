-- Create database (uncomment if needed)
-- CREATE DATABASE your_database_name;
-- USE your_database_name;

-- Roles table
CREATE TABLE roles (
  rol_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Users table
CREATE TABLE usuarios (
  usuario_id INT AUTO_INCREMENT PRIMARY KEY,
  rol_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  avatar_url VARCHAR(255),
  verificado BOOLEAN DEFAULT FALSE,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(rol_id)
);

-- Reservation table
CREATE TABLE reserva (
  reserva_id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  hora_llegada TIME NOT NULL,
  hora_salida TIME NOT NULL,
  cantidad_personas INT NOT NULL,
  monto_total DECIMAL(10,2) NOT NULL,
  registro_fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  dia_reserva DATE NOT NULL,
  nombre_usuario VARCHAR(100) NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES producto(producto_id)
);

-- Ticket table
CREATE TABLE ticket (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id INT NOT NULL,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('generado', 'utilizado') DEFAULT 'generado',
  qr_url VARCHAR(255),
  nombre_usuario TEXT NOT NULL,
  FOREIGN KEY (reserva_id) REFERENCES reserva(reserva_id)
);

-- Product attributes table
CREATE TABLE atributo_producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT,
  nombre_atributo VARCHAR(50),
  valor TEXT,
  tipo_dato VARCHAR(20),
  FOREIGN KEY (producto_id) REFERENCES producto(producto_id)
);

-- Location table
CREATE TABLE ubicacion (
  ubicacion_id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  pais VARCHAR(100),
  ciudad VARCHAR(100),
  direccion VARCHAR(255),
  codigo_postal VARCHAR(20),
  longitud DECIMAL(10,7),
  FOREIGN KEY (producto_id) REFERENCES producto(producto_id)
);

-- Products table
CREATE TABLE producto (
  producto_id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_producto_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  capacidad INT,
  normas TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  precio_hora DECIMAL(10,2),
  imagen VARCHAR(255),
  FOREIGN KEY (tipo_producto_id) REFERENCES tipo_producto(tipo_id),
);

-- Product type table
CREATE TABLE tipo_producto (
  tipo_id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  icono_url VARCHAR(255)
);


-- Audit table
CREATE TABLE auditoria (
  auditoria_id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  tabla_afectada VARCHAR(100) NOT NULL,
  registro_id_afectado INT,
  descripcion_cambio TEXT,
  fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
);


-- -- Indexes for better performance
-- CREATE INDEX idx_producto_tipo ON producto(tipo_producto_id);
-- CREATE INDEX idx_producto_usuario ON producto(usuario_id);
-- CREATE INDEX idx_ubicacion_producto ON ubicacion(producto_id);
-- CREATE INDEX idx_atributo_producto ON atributo_producto(producto_id);
-- CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
-- CREATE INDEX idx_reserva_producto ON reserva(producto_id);
-- CREATE INDEX idx_ticket_reserva ON ticket(reserva_id);