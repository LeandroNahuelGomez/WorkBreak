const { userCreateSchema, userLoginSchema } = require("../schemas/user.schema");
const bcrypt = require("bcryptjs");
const User = require("../models/usuario.model");


class UserRepository {
    static async create({ username, password }) {
        try {
            //1. Validar con Zod(lanza un error si los datos son invalidos)
            const validateData = userCreateSchema.parse({ username, password });

            //2. Verificar si el username ya existe
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) throw new Error("El username ya esta registrado");

            //3. Hashear la contraseña
            const hashedPassword = await bcrypt.hash(validateData.password, 10);

            //4. Crear el usuario en la base de datos (usando Sequelize)
            const newUser = await User.create({
                username: validateData.username,
                password: hashedPassword,
            });

            return newUser.id;
        } catch (error) {
            //Captura errores de Zod y otros errores
            if (error instanceof z.ZodError) {
                throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(", ")}`);
            }
            throw error;
        }
    }
    static async login({ username, password }) {
        try {
            // 1. Validar con Zod
            const validatedData = userLoginSchema.parse({ username, password });

            // 2. Buscar usuario en la base de datos
            const user = await User.findOne({ where: { username: validatedData.username } });
            if (!user) throw new Error("Usuario no encontrado");

            // 3. Comparar contraseñas hasheadas
            const isValid = await bcrypt.compare(validatedData.password, user.password);
            if (!isValid) throw new Error("Contraseña incorrecta");

            const {password: _, ...publicUser} = user; // Devuelve el usuario si todo es correcto

            return publicUser;

        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(`Datos inválidos: ${error.errors.map(e => e.message).join(", ")}`);
            }
            throw error;
        }
    }
}






// export class UserRepository {
//     static async create({username, password}){
//         //1. Validaciones de username (opcional: usar zod)
//         if(typeof username != "string") throw new Error("Username must be a string");
//         if (username.length < 3) throw new Error("username must be at least 3 characters long");
//         if (typeof password != "string") throw new Error("password must be a string");
//         if(password.length < 6)throw new Error("password must be at leats 6 characters long");

//         //2. ASEGURARSE QUE EL USERNAME NO EXISTE
//         const user = await UserRepository.finOne({username})
//         if (user ) throw new Error("username already exists");


//         //Vamos a hashear nuestro password
//         const hashedPassword = await bcrypt.hashSync(password, 10); //Esto hashea al password, el numero es el numero de vueltas que va a dar a esa contraseña, osea mientras mas grande sea va a tardar mas tiempo


//         //const id = crypto.randomUUID(); -> Puede tener problemas de rendimiento
//         User.create({
//             _id: IdleDeadline,
//             username,
//             password: hashedPassword
//         }).save()

//         return id

//     }

//     static async login({username, password}){
//         //Aca pondriamos una schema de zod tanto para crear como para loguear. Porque directamente utilizamos el schema.

//         const user = User.findOne({username});
//         if(!user) throw new Error("username does not exist");

//         const isValid = await bcrypt.compareSync(password, user.password);
//         if(!isValid) throw new Error("password is invalid");
//     }
// }