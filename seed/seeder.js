import {exit} from 'node:process'
import categories from './categories.js'
import prices from './prices.js'
import users from './users.js'
import db from '../config/db.js'
import {Category,Price, User, Property} from '../models/index.js'

const importData = async() =>{
    try {
        //Autenticar
        await db.authenticate()

        //Generar columnas
        await db.sync({ force: true });


        //Insertar datos
        //Si no depende uno de otro se usa Promise.all en vez de un doble await
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])

        console.log('Datos importados correctamente')
        exit(0)//finaliza la ejecucion del codigo con exito
    } catch (error) {
        console.log(error)
        exit(1)//finaliza la ejecucion del codigo con error
    }
}

const deleteData = async () => {
    try {
        // Primero elimina los registros de la tabla que tiene las claves foráneas
        await Property.destroy({ where: {}, force: true });

        // Luego elimina el resto
        await Promise.all([
            Category.destroy({ where: {}, force: true }),
            Price.destroy({ where: {}, force: true }),
            User.destroy({ where: {}, force: true })
        ]);

        console.log('Data deleted successfully');
        exit(0);
    } catch (error) {
        console.log(error);
        exit(1);
    }
};


if(process.argv[2] ==="-e"){
    deleteData();
}

if(process.argv[2] ==="-i"){
    importData();
}