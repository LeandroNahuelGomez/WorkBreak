const Roles = require('./roles.model');
const Usuarios = require('./usuarios.model');
const TipoProducto = require('./tipoProducto.model');
const Producto = require('./producto.model');
const Ubicacion = require('./ubicacion.model');
const AtributoProducto = require('./atributoProducto.model');
const Auditoria = require('./auditoria.model');
const Reserva = require('./reserva.model');
const Ticket = require('./ticket.model');

// Relación Usuarios -> Roles
Usuarios.belongsTo(Roles, { foreignKey: 'rol_id' });
Roles.hasMany(Usuarios, { foreignKey: 'rol_id' });

// Relación Producto -> TipoProducto
Producto.belongsTo(TipoProducto, { foreignKey: 'tipo_producto_id' });
TipoProducto.hasMany(Producto, { foreignKey: 'tipo_producto_id' });

// Relación Producto -> Usuarios
Producto.belongsTo(Usuarios, { foreignKey: 'usuario_id' });
Usuarios.hasMany(Producto, { foreignKey: 'usuario_id' });

// Relación Ubicacion -> Producto
Ubicacion.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasOne(Ubicacion, { foreignKey: 'producto_id' });

// Relación AtributoProducto -> Producto
AtributoProducto.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(AtributoProducto, { foreignKey: 'producto_id' });

// Relación Auditoria -> Usuarios
Auditoria.belongsTo(Usuarios, { foreignKey: 'usuario_id' });
Usuarios.hasMany(Auditoria, { foreignKey: 'usuario_id' });

// Relación Reserva -> Producto
Reserva.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(Reserva, { foreignKey: 'producto_id' });

// Relación Ticket -> Reserva
Ticket.belongsTo(Reserva, { foreignKey: 'reserva_id' });
Reserva.hasOne(Ticket, { foreignKey: 'reserva_id' });

module.exports = {
  Roles,
  Usuarios,
  TipoProducto,
  Producto,
  Ubicacion,
  AtributoProducto,
  Auditoria,
  Reserva,
  Ticket
};