const { Sequelize } = require("sequelize"); //Es la clase principal del ORM. nos permite crear una conexion con una base de datos y definir modelos
const dotenv = require("dotenv"); //Permite leer las variables de entorno desde un arhcivo 

dotenv.config(); //Esta linea lee el archivo .env que debe estar en la raiz del rpoyecto y carga sus variables

const sequelize = new Sequelize(
    //Primer parametro que necesita que le pasemos el nombre de la base de datos
    process.env.DB_NAME,
    //Segundo parametro que necesita que le pasemos es el usuario de la base de datos
    process.env.DB_USER,
    //El tercer parametro que necesita que le pasemos es la contraseña
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST, //Direccion del servidor
        dialect: "mysql", //motor de base de datos
        logging: false, //Si queremos que se vean en consola los SQL que ejecuta
        pool: {
            max:5, //Maximo de conexiones al mismo tiempo
            min:0, //Minimo de conexiones abiertas
            acquire: 30000, //Tiempo maximo para intentar conectarse antes de tirar un error
            idle: 10000 //tiempo maximo que una conexion puede estar inactiva antes de cerrarse
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate(); //Es un metodo que pueba si las credenciales y la conexion con la base de datos funciona correctamente
        console.log("Conexion a la base de datos establecida correctamente")
    } catch (error) {
        console.log("Error al conectar a la base de datos: ", error);
    }
}

testConnection();

module.exports = {sequelize, testConnection};