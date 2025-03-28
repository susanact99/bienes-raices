import { Sequelize } from "sequelize";
import  dotenv  from "dotenv";
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define:{
        timestamps: true //cuando el user se registra crea dos columnas en automatico una cuando el user se       registra y otro cuando fue actualizado
    },
    pool: {
        max: 5,            //maximo 5 conexiones por usuario
        min: 0,
        acquire: 30000,    //30s tratando de crear una conexion antes de marcar un error
        idle: 10000        //si no hay visitas da 10s para que la conexion finalice
    },
    operatorAliases: false
})

export default db;