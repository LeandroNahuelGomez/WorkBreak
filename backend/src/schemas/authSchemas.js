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
const loginSchema = z.object({
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


module.exports = {
  loginSchema,
  registerSchema
}

