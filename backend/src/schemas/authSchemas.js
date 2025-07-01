//Importo la libreria zod para validacion de datos con el uso de schemas
const { z } = require('zod');

//Creamos el schema para el login
//El login de nuestros usuarios va a tener 4 cosas:
//Nombre - Apellido - Email - Password

// Esquema común para datos de nombre/apellido
const nameSchema = z.string()
  .min(2, { message: "Debe tener al menos 2 caracteres" })
  .max(20, { message: "No puede exceder los 20 caracteres" })
  .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/, {
    message: "Solo puede contener letras y espacios"
  });

// Esquema para contraseña segura
const passwordSchema = z.string()
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
  .regex(/[a-z]/, { message: "Debe contener al menos una minúscula" })
  .regex(/[0-9]/, { message: "Debe contener al menos un número" })
  .regex(/[^A-Za-z0-9]/, { message: "Debe contener al menos un carácter especial" });

// Esquema para login
const loginEmpleadoSchema = z.object({
  email: z.string()
    .email({ message: "Correo electrónico inválido" })
    .max(100, { message: "El correo no puede exceder 100 caracteres" }),
  password: passwordSchema
});

// Esquema para login
const loginAdminSchema = z.object({
  nombre: nameSchema,
  apellido: nameSchema,
  email: z.string()
    .email({ message: "Correo electrónico inválido" })
    .max(100, { message: "El correo no puede exceder 100 caracteres" }),
  password: passwordSchema
});

// Esquema para registro
const registerSchema = z.object({
  email: z.string()
    .email({ message: "Correo electrónico inválido" })
    .max(100, { message: "El correo no puede exceder 100 caracteres" }),
  contraseña: passwordSchema,
  nombre: nameSchema,
  apellido: nameSchema,
  telefono: z.string()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
    .max(15, { message: "El teléfono no puede tener más de 15 dígitos" })
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números" })
});

const ubicacionSchema = z.object({
    producto_id: z.number({
    required_error: "El ID del producto es requerido",
    invalid_type_error: "El ID del producto debe ser un número"
  }).int().positive(),
  
  pais: z.string({
    required_error: "El país es requerido",
    invalid_type_error: "El país debe ser un texto"
  })
  .max(100, "El país no puede exceder los 100 caracteres")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/, "El país solo puede contener letras y espacios"),
  
  ciudad: z.string({
    required_error: "La ciudad es requerida",
    invalid_type_error: "La ciudad debe ser un texto"
  })
  .max(100, "La ciudad no puede exceder los 100 caracteres")
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/, "La ciudad solo puede contener letras y espacios"),
  
  direccion: z.string({
    required_error: "La dirección es requerida",
    invalid_type_error: "La dirección debe ser un texto"
  })
  .max(255, "La dirección no puede exceder los 255 caracteres"),
  
  codigo_postal: z.string({
    required_error: "El código postal es requerido",
    invalid_type_error: "El código postal debe ser un texto"
  })
  .max(20, "El código postal no puede exceder los 20 caracteres")
  .regex(/^[a-zA-Z0-9\s-]+$/, "Solo letras, números, guiones y espacios"),
  
  longitud: z.number({
    invalid_type_error: "La longitud debe ser un número decimal"
  })
  .min(-180, "La longitud mínima es -180")
  .max(180, "La longitud máxima es 180")
  .optional(), // Opcional si no es un campo requerido
  
  latitud: z.number({
    invalid_type_error: "La latitud debe ser un número decimal"
  })
  .min(-90, "La latitud mínima es -90")
  .max(90, "La latitud máxima es 90")
  .optional() // Opcional si no está en tu tabla pero es común en ubicaciones
});


const ticketSchema = z.object({
  ticket_id: z.number().int().positive().optional(), // Auto-increment, optional para creación
  reserva_id: z.number().int().positive(), // Debe ser un número positivo
  codigo_ticket: z.string()
    .min(1, { message: "El código del ticket no puede estar vacío" })
    .max(20, { message: "El código del ticket no puede exceder 20 caracteres" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "El código solo puede contener letras, números, guiones y guiones bajos" }),
  fecha_emision: z.date().optional(), // Opcional porque tiene valor por defecto
  estado: z.enum(['generado', 'pagado', 'cancelado', 'utilizado']).default('generado'),
  qr_url: z.string()
    .max(255, { message: "La URL del QR no puede exceder 255 caracteres" })
    .url({ message: "Debe ser una URL válida" })
    .optional()
    .nullable(),
  detalles: z.string().optional().nullable()
});

const rolSchema = z.object({
  rol_id: z.number().int().positive().optional(), // Auto-increment, opcional para creación
  nombre: z.string()
    .min(1, { message: "El nombre del rol no puede estar vacío" })
    .max(50, { message: "El nombre del rol no puede exceder 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
      message: "El nombre solo puede contener letras y espacios" 
    })
});


module.exports = {
  loginEmpleadoSchema,
  loginAdminSchema,
  registerSchema,
  ubicacionSchema,
  rolSchema,
  ticketSchema
}

